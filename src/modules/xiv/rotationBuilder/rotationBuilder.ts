import { LightningElement } from 'lwc';
import { getActionInfo, getJobNames, getJobActions } from 'xiv/actionRepository';
import type { Action, Buff } from 'xiv/actionData'; // Assuming you have an Action interface
import { JobGuide } from 'xiv/actionData';

function hasOwnProperty(obj: Action, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, property);
}

export default class RotationBuilder extends LightningElement {
    job: string = 'paladin';
    jobActions: Action[] = getJobActions(this.job);
    totalPotency: number = 0;
    gcdTime: number = 2.5;
    mockActionList: Action[] = [].map(() => getActionInfo('paladin', '')).filter((action): action is Action => action !== undefined);
    jobList: string[] = getJobNames() as string[];
    skillDetails: string = '';
    errorDetails: string = '';

    changeJob(): void {
        this.job = (this.template?.querySelector('select') as HTMLSelectElement).value;
        this.mockActionList = [].map(() => getActionInfo(this.job, '')).filter((action): action is Action => action !== undefined);
        this.jobActions = getJobActions(this.job);
    }

    validation(actionList: Action[], job: string): void {
        const potencyAndTime = validateActions(actionList, job, this.gcdTime, true);
        const totalPotency = potencyAndTime[0];
        const totalTime = potencyAndTime[1];

        if (totalPotency === 0) { // No actions on timeline
            (this.template?.querySelector('lightning-card.potencyLabel') as HTMLElement).title =
                'Total Potency: Add actions to receive a potency.';
            (this.template?.querySelector('lightning-card.ppsLabel') as HTMLElement).title =
                'Potency Per Second: Add actions to receive a pps.';
        } else if (totalPotency === -1) { // Invalid action list
            (this.template?.querySelector('lightning-card.potencyLabel') as HTMLElement).title =
                'Total Potency: Unable to calculate potency with invalid action(s).';
            (this.template?.querySelector('lightning-card.ppsLabel') as HTMLElement).title =
                'Potency Per Second: Unable to calculate pps with invalid action(s).';
        } else { // Valid action list of length >= 1
            const PPS = Math.round((totalPotency / totalTime) * 100) / 100;
            (this.template?.querySelector('lightning-card.potencyLabel') as HTMLElement).title =
                `Total Potency: ${totalPotency}`;
            (this.template?.querySelector('lightning-card.ppsLabel') as HTMLElement).title =
                `Potency Per Second: ${PPS}`;
        }
    }

    addTimelineAction(e: CustomEvent): void {
        this.mockActionList.push(
            JSON.parse(JSON.stringify(getActionInfo(this.job, e.detail.actionName)))
        );
        this.mockActionList = [...this.mockActionList];

        this.validation(this.mockActionList, this.job);
    }

    removeAction(e: CustomEvent): void {
        this.mockActionList.splice(e.detail.indexToRemove, 1);
        this.mockActionList = [...this.mockActionList];

        this.validation(this.mockActionList, this.job);
    }

    updateGCD(gcd: number): void {
        this.gcdTime = gcd;
    }

    clearList(): void {
        this.mockActionList = [].map(() => getActionInfo('paladin', '')).filter((action): action is Action => action !== undefined);
        this.validation(this.mockActionList, this.job);
    }

    spliceTimelineAction(e: CustomEvent): void {
        const movedItem = this.mockActionList.splice(e.detail.currentIndex, 1)[0];
        this.mockActionList.splice(e.detail.destinationIndex, 0, movedItem);
        this.mockActionList = [...this.mockActionList];

        this.validation(this.mockActionList, this.job);
    }

    updateSkillCard(e: CustomEvent): void {
        const card = this.template?.querySelector('.skillCard') as HTMLElement;
        card.title = e.detail.actionName;
        let text = e.detail.actionDescription;
        text = text.replaceAll(' n ', '\n');
        text = text.replaceAll('<br>', ' ');
        this.skillDetails = text;
    }

    showErrorCard(e: CustomEvent): void {
        const card = this.template?.querySelector('.errorCard') as HTMLElement;
        card.style.visibility = 'visible';
        this.errorDetails = `${e.detail.error}`;
    }

    hideErrorCard(): void {
        const card = this.template?.querySelector('.errorCard') as HTMLElement;
        card.style.visibility = 'hidden';
        this.errorDetails = '';
    }
}

// Function the validate the list of Actions, ensuring they meet the requirements of execution
export function validateActions(actionList: Action[], job: string, gcdTime: number, draw: boolean): number[] {
    if (draw) {
        actionList.forEach(action => {
            action.location = 'list';
            action.errorMessage = '';
        });
    }

    if (actionList.length === 0) {
        return [0, 0];
    }

    const timedList = findTimes(actionList, gcdTime);

    // Setting startTime and timeTaken for each action in the timed list
    timedList.forEach((timedAction, i) => {
        const castTime = timedAction[0].cast === 'Instant' ? 0.7 : parseFloat(timedAction[0].cast || '0.7');
        if (i === 0) {
            actionList[0].startTime = timedAction[1] - castTime;
            actionList[0].timeTaken = castTime;
        } else {
            actionList[i].startTime = timedAction[1] - castTime;
            actionList[i - 1].timeTaken = actionList[i].startTime - (actionList[i - 1].startTime || 0);
        }
        if (i === timedList.length - 1) {
            actionList[i].timeTaken = castTime;
        }
    });

    // Initializing gauge amounts
    const gaugeAmounts: Record<string, number>[] = [];
    Object.keys(JobGuide[job].gauges).forEach(gauge => {
        gaugeAmounts.push({ [gauge]: 0 });
    });

    const invalidActionList: [Action, number, string][] = [];
    const buffList = getBuffs(timedList);

    timedList.forEach((timedAction, i) => {
        const currAction = timedAction[0];

        // Gauge requirements validation
        gaugeValidation(gaugeAmounts, currAction, timedAction, invalidActionList, i);

        // Buff requirement validation
        buffValidation(buffList, currAction, timedAction, invalidActionList, i);

        // Checking transformsFrom dependency
        transformationValidation(timedList, currAction, timedAction, invalidActionList, i);
    });

    // Handle invalid actions
    if (invalidActionList.length > 0) {
        if (draw) {
            invalidActionList.forEach(([, index, message]) => {
                actionList[index].location = 'invalid';
                actionList[index].errorMessage = message;
            });
        }
        return [-1, 0];
    }

    // Run the calculation if valid
    return calculatePotency(timedList);
}

// START VALIDATION HELPER FUNCTIONS //

// Validation Helper Function: Gauges
function gaugeValidation(
    gaugeAmounts: Record<string, number>[], 
    currAction: Action, 
    timedAction: [Action, number], 
    invalidActionList: [Action, number, string][], 
    index: number
): void {
    gaugeAmounts.forEach((gauge, j) => {
        const gaugeName = Object.keys(gauge)[0];
        const newGaugeValue = currAction.cast === 'Instant'
            ? 5 * Math.floor((timedAction[1] - 0.7) / 2.5)
            : 5 * Math.floor((timedAction[1] - parseFloat(currAction.cast || '0')) / 2.5);

        gaugeAmounts[j][gaugeName] = newGaugeValue;

        // Check for gauge resources needed to use an Action
        if (Object.prototype.hasOwnProperty.call(currAction, gaugeName)) {
            if ((gaugeAmounts[j][gaugeName] + currAction[gaugeName]) < 0) {
                invalidActionList.push([
                    currAction,
                    index,
                    `Not enough ${gaugeName} to cast ${currAction.name}.`
                ]);
            } else {
                gauge[gaugeName] += currAction[gaugeName];
            }
        }
    });
}

// Validation Helper Function: Buffs
function buffValidation(
    buffList: Buff[], 
    currAction: Action, 
    timedAction: [Action, number], 
    invalidActionList: [Action, number, string][], 
    index: number
): void {
    // Ensure the required buffs to execute an Action are active
    if (currAction?.buffRequirement) {
        const { buffRequirement, name: actionName } = currAction;
        const relevantBuffs = buffList.filter(buff => buff.name === buffRequirement);

        if (!relevantBuffs.length) {
            invalidActionList.push([
                currAction,
                index,
                `${buffRequirement} is not active at this time to cast ${actionName}.`
            ]);
        } else {
            const isBuffValid = relevantBuffs.some(buff => {
                const isInTimeRange = timedAction[1] >= buff.startTime && timedAction[1] <= buff.endTime;
                if (isInTimeRange && buff.value > 0) {
                    buff.value -= 1; // Consume a stack
                    return true;
                }
                if (isInTimeRange && buff.value <= 0) {
                    invalidActionList.push([
                        currAction,
                        index,
                        `You are missing stacks of the ${buffRequirement} to cast ${actionName}.`
                    ]);
                }
                return false;
            });

            if (!isBuffValid) {
                invalidActionList.push([
                    currAction,
                    index,
                    `${buffRequirement} is not active at this time to cast ${actionName}.`
                ]);
            }
        }
    }
}

// Validation Helper Function: transformsFrom
function transformationValidation(
    timedList: [Action, number][], 
    currAction: Action, 
    timedAction: [Action, number], 
    invalidActionList: [Action, number, string][], 
    index: number
): void {
    // Ensure Actions that transform/change into others can only be execute in order without interuption
    if (Object.prototype.hasOwnProperty.call(currAction, 'transformsFrom') && !currAction.isAbility) {
        const precedingActionName = currAction.transformsFrom;
        let precedingActionIndex = -1;

        // Find the index of the preceding action
        for (let j = 0; j < index; j++) {
            if (timedList[j][0].name === precedingActionName) {
                precedingActionIndex = j;
                break;
            }
        }

        // Validate the preceding action
        const precedingAction = timedList[precedingActionIndex] ? timedList[precedingActionIndex][0] : null;
        if (precedingAction && invalidActionList.find(([action]) => action.name === precedingAction.name)) {
            // If preceding action is invalid, mark the current action as invalid
            invalidActionList.push([
                currAction,
                index,
                `${currAction.name} cannot be executed because the required preceding action ${precedingActionName} is invalid.`
            ]);
        } else {
            // Validate the preceding action (existing logic)
            if (precedingActionIndex === -1 || timedList[precedingActionIndex][1] >= timedAction[1]) {
                invalidActionList.push([
                    currAction,
                    index,
                    `${currAction.name} cannot be executed because the required action ${precedingActionName} was not executed beforehand.`
                ]);
            } else {
                // Check for duplicate currAction.name after precedingActionName and before currAction
                for (let j = precedingActionIndex + 1; j < index; j++) {
                    if (timedList[j][0].id === currAction.id) {
                        invalidActionList.push([
                            currAction,
                            index,
                            `${currAction.name} cannot be executed because it appears after ${precedingActionName} but before it is properly executed.`
                        ]);
                        break;
                    } else if (timedList[j][0].isSpell || timedList[j][0].isWeaponskill) {
                        invalidActionList.push([
                            currAction,
                            index,
                            `${currAction.name} cannot be executed because it appears after ${timedList[j][0].name} and not it's required preceding action.`
                        ]);
                        break;
                    }
                }
            }
        }
    }
}

// END VALIDATION HELPER FUNCTIONS //

export function findTimes(actionList: Action[], GCDTime: number): [Action, number][] {
    let currTime = 0;
    const waitTime = 0.7;

    // Process the first action outside the loop
    if (actionList[0].cast === 'Instant') {
        currTime = waitTime;
    } else {
        currTime = actionList[0].castNumeric!; // Use the numeric cast time
    }

    // Initialize the timed list with the first action
    const timedList: [Action, number][] = [[actionList[0], currTime]];

    // Track when actions can be reused
    const usedActions: [string, number][] = [[actionList[0].name, actionList[0].recastNumeric!]];

    // Track the last GCD action
    let lastTime = 0;
    let lastGCD: [string, number] = [actionList[0].name, lastTime];

    // If the first action is an ability, mark it as not a GCD (-1)
    if (actionList[0].type === 'Ability') {
        lastGCD[1] = -1;
    }

    // Process the rest of the actions
    for (let i = 1; i < actionList.length; i++) {
        const currAction = actionList[i];

        // Ensure the action is off cooldown
        for (let j = 0; j < usedActions.length; j++) {
            if (
                currAction.name === usedActions[j][0] &&
                currTime < usedActions[j][1]
            ) {
                currTime = usedActions[j][1];
            }
        }

        // Handle GCD actions
        if (currAction.type === 'Spell' || currAction.type === 'Weaponskill') {
            if (currAction.cast === 'Instant') {
                // Instant actions
                if (currTime <= lastGCD[1] + GCDTime && lastGCD[1] !== -1) {
                    currTime = lastGCD[1] + GCDTime + waitTime;
                } else {
                    currTime += waitTime;
                }
                lastTime = currTime - waitTime;
            } else {
                // Non-instant actions
                if (currTime <= lastGCD[1] + GCDTime && lastGCD[1] !== -1) {
                    currTime = lastGCD[1] + GCDTime + currAction.castNumeric!;
                } else {
                    currTime += currAction.castNumeric!;
                }
                lastTime = currTime - currAction.castNumeric!;
            }

            // Add the action to the timed list
            const currPair: [Action, number] = [currAction, Math.round(currTime * 10) / 10];
            timedList.push(currPair);

            // Update the last GCD action
            lastGCD = [currAction.name, Math.round(lastTime * 10) / 10];
        } else {
            // Handle abilities (non-GCD actions)
            currTime += waitTime;
            const currPair: [Action, number] = [currAction, Math.round(currTime * 10) / 10];
            timedList.push(currPair);
        }

        // Add the action to the used actions list for cooldown tracking
        if (currAction.cast !== 'Instant') {
            if (currAction.recastNumeric! >= currAction.castNumeric!) {
                usedActions.push([currAction.name, currTime]);
            } else {
                usedActions.push([currAction.name, lastTime + currAction.recastNumeric!]);
            }
        } else {
            usedActions.push([currAction.name, lastTime + currAction.recastNumeric!]);
        }
    }

    return timedList;
}

// Function to find all the buffs applied by Actions in the sequence
export function getBuffs(timedList: [Action, number][]): Buff[] {
    const currBuffs: Buff[] = [];

    for (let i = 0; i < timedList.length; i++) {
        const currAction = timedList[i][0];
        const currTime = timedList[i][1];

        // Add any 'damageBuff' an Action may apply
        if (hasOwnProperty(currAction, 'damageBuff')) {
            currBuffs.push({ 
                name: 'damageBuff', 
                value: currAction.damageBuff || 0, 
                startTime: currTime, 
                endTime: currTime + (currAction.durationNumeric || 0)
            });
        }

        // Add each 'grants' buff that an Action may apply
        if (hasOwnProperty(currAction, 'grants') && currAction.grantsNumeric) {
            Object.entries(currAction.grantsNumeric).forEach(([key, value]) => {
                currBuffs.push({
                    name: key.toLowerCase(),
                    value,
                    startTime: currTime,
                    endTime: currTime + 30
                });
            });
        }

        // Add an Action's 'comboBonus' buff if it exists and if all Actions necessary to satisfy the combo are present
        if (hasOwnProperty(currAction, 'comboBonus') && currAction.comboBonusNumeric) {
            // Check if the comboAction chain is valid
            let isComboValid = false;
        
            // Find the index of currAction.comboAction
            const comboActionIndex = timedList.findIndex(
                ([action, time]) => action.name === currAction.comboAction && time < currTime
            );
    
            // comboAction doesn't exist in the sequence, skip to next Action
            if (comboActionIndex === -1) continue;

            const actionInCombo = timedList[comboActionIndex][0];

            // Check if the action in the combo itself has a comboAction and validate it
            if (actionInCombo.comboAction) {
                const secondaryComboActionIndex = timedList.findIndex(
                    ([action, time]) => action.name === actionInCombo.comboAction && time < timedList[comboActionIndex][1]
                );

                isComboValid = secondaryComboActionIndex !== -1;
            } else {
                // No secondary comboAction, so combo chain is valid
                isComboValid = true;
            }
        
            if (isComboValid) {
                // Add comboBonus to currBuffs if combo chain is valid
                Object.entries(currAction.comboBonusNumeric).forEach(([key, value]) => {
                    currBuffs.push({
                        name: key.toLowerCase(),
                        value,
                        startTime: currTime,
                        endTime: currTime + 30,
                    });
                });
            }
        }
    }

    return currBuffs;
}

// Function to calculate the total potency of a list of Actions
export function calculatePotency(timedList: [Action, number][]): number[] {
    let currTime = 0;
    let totalPotency = 0;
    let currBuffs = getBuffs(timedList);
    let lastAction: Action | null = null;

    for (let i = 0; i < timedList.length; i++) {
        const currAction = timedList[i][0];
        currTime = timedList[i][1];
        let buffMultiplier = 1;
        let extraPotency = 0;
        const priorityBuffUsed = false;

        // Remove expired buffs
        currBuffs = currBuffs.filter(buff => buff.endTime > currTime); 

        // Apply active buffs
        for (let j = 0; j < currBuffs.length; j ++) {
            if (currBuffs[j].startTime <= currTime && currBuffs[j].value > 0) {
                if (currBuffs[j].name === 'damageBuff') {
                    buffMultiplier *= currBuffs[j].value;
                } else if (hasOwnProperty(currAction, currBuffs[j].name) && !priorityBuffUsed) { // Make sure priority buffs are used first
                    if (hasOwnProperty(currAction, 'priorityBuff') && (currBuffs[j].name === currAction.priorityBuff || !currBuffs.some(buff => buff.name === currAction.priorityBuff))) {
                        extraPotency += currAction[currBuffs[j].name] || 0;
                        currBuffs[j].value--;
                    }
                }
            }

            if (currBuffs[j].value === 0) {
                currBuffs.splice(j, 1);
                j--;
            }
        }

        // Handle transformsFrom potency
        if (hasOwnProperty(currAction, 'transformsFrom')) {
            const precedingAction = timedList.find(
                ([action, time]) => action.name === currAction.transformsFrom && time < currTime
            )?.[0];

            if (extraPotency > 0) { // Check for extra potency from buffs first
                totalPotency += extraPotency * buffMultiplier
            } else if (precedingAction) { // Potency if there is no extra potency 
                totalPotency += (currAction.potencyNumeric || 0) * buffMultiplier;
            }
        } else {
            // Calculate potency based on action type
            if (currAction.isSpell || currAction.isWeaponskill) {
                if (extraPotency > 0) {
                    totalPotency += extraPotency * buffMultiplier;
                } else if (currAction.comboAction === lastAction?.name && hasOwnProperty(currAction, 'comboAction')) {
                    totalPotency += (currAction.comboPotencyNumeric || 0) * buffMultiplier;
                } else if (hasOwnProperty(currAction, 'potency')) {
                    totalPotency += (currAction.potencyNumeric || 0) * buffMultiplier;
                }
                lastAction = currAction;
            }

            if (currAction.isAbility && hasOwnProperty(currAction, 'potency')) {
                totalPotency += (currAction.potencyNumeric || 0) * buffMultiplier;
            }
        }
    }

    return [totalPotency, currTime];
}