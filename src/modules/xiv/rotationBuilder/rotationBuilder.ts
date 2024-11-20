import { LightningElement } from 'lwc';
import { getActionInfo, getJobNames, getJobActions } from 'xiv/actionRepository';
import type { Action } from 'xiv/actionData'; // Assuming you have an Action interface

function hasOwnProperty(obj: any, property: string): boolean {
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

    changeJob() {
        this.job = (this.template?.querySelector('select') as HTMLSelectElement).value;
        this.mockActionList = [].map(() => getActionInfo(this.job, '')).filter((action): action is Action => action !== undefined);
        this.jobActions = getJobActions(this.job);
    }

    validation(actionList: Action[], job: string): number {
        const totalPotency = validateActions(actionList, job, this.gcdTime);

        if (totalPotency === 0) {
            (this.template?.querySelector('lightning-card.potencyLabel') as HTMLElement).title =
                'Total Potency: Add actions to receive a potency.';
            (this.template?.querySelector('lightning-card.ppsLabel') as HTMLElement).title =
                'Potency Per Second: Add actions to receive a pps.';
        }
            
        return totalPotency;
    }

    addTimelineAction(e: CustomEvent): void {
        const actionName = e.detail.actionName;
        const { totalPotency, PPS } = addActionToTimeline(this.mockActionList, this.job, actionName, this.gcdTime);

        this.mockActionList = [...this.mockActionList];

        (this.template?.querySelector('lightning-card.potencyLabel') as HTMLElement).title =
            `Total Potency: ${totalPotency}`;
        (this.template?.querySelector('lightning-card.ppsLabel') as HTMLElement).title =
            `Potency Per Second: ${PPS}`;
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

export function validateActions(actionList: Action[], job: string, gcdTime: number): number {
    actionList.forEach(action => {
        action.location = 'list';
        action.errorMessage = '';
    });

    if (actionList.length === 0) {
        return 0;
    }

    const timedList = findTimes(actionList, gcdTime);
    timeActionList(actionList, gcdTime);
    const totalPotency = calculatePotency(timedList);

    return totalPotency;
}

export function addActionToTimeline(actionList: Action[], job: string, actionName: string, gdcTime: number): { totalPotency: number; PPS: number } {
    const action = getActionInfo(job, actionName);
    if (action) {
        actionList.push(
            JSON.parse(JSON.stringify(action))
        );
    }

    const totalPotency = validateActions(actionList, job, gdcTime);

    const time = sumTimeTaken(actionList, gdcTime);
    const PPS = time ? Math.round((totalPotency / time) * 100) / 100 : 0;

    return { totalPotency, PPS };
}

export function sumTimeTaken(actionList: Action[], gcdTime: number): number {
    timeActionList(actionList, gcdTime);
    const totalTime = actionList.reduce((sum, action) => sum + (action.timeTaken || 0), 0);
    return totalTime;
}

// Function to time how long each action of the action list takes to execute and at what time each action begins on the timeline
export function timeActionList(actionList: Action[], gcdTime: number): void {
    for (let i = 0; i < actionList.length; i++) {
        let castTime = actionList[i].isInstant ? 0.7 : (actionList[i].castNumeric || 0); // Always begin with the assumption that there exists a slight delay time to execute instant actions

        // Scenario 1. GCD action immediately after GCD action: GCD time in between GCD actions
        // Scenario 2. Two GCD actions with an oGCD action in between: GCD time between GCD actions
        // Scenario 3. Two GCD actions with two oGCD actions in between: GCD time between GCD actions
        // Scenario 4. GCD action and oGCD action with two oGCD actions in between: GCD time between GCD action and last oGCD action
        const needsGCD = (
            (i > 0 && (actionList[i - 1]?.isWeaponskill || actionList[i - 1]?.isSpell) && !actionList[i]?.isAbility) ||
            (i > 1 && (actionList[i - 2]?.isWeaponskill || actionList[i - 2]?.isSpell) && !actionList[i]?.isAbility && actionList[i - 1]?.isAbility) ||
            (i > 2 && (actionList[i - 3]?.isWeaponskill || actionList[i - 3]?.isSpell) && !actionList[i]?.isAbility && actionList[i - 1]?.isAbility && actionList[i - 2]?.isAbility) ||
            (i > 2 && actionList[i]?.isAbility && actionList[i - 1]?.isAbility && actionList[i - 2]?.isAbility && (actionList[i - 3]?.isWeaponskill || actionList[i - 3]?.isSpell))
        ) && castTime < gcdTime;

        // Get the index of the most recent GCD action
        const mostRecentSkillSpell = (() => {
            for (let j = i - 1; j >= 0; j--) {
                if (!actionList[j].isAbility) {
                    return j;
                }
            }

            return -1;
        })();

        if (i === 0) { // First Action in Timeline
            actionList[0].startTime = 0;
            actionList[0].timeTaken = castTime;
        } else { // All Other Actions
            if (needsGCD && mostRecentSkillSpell !== -1) { // Scenario 4
                actionList[i].startTime = (actionList[mostRecentSkillSpell].startTime || 0) + gcdTime;
            } else if (needsGCD) { // Scenario 1, 2, and 3
                actionList[i].startTime = (actionList[i - 1].startTime || 0) + gcdTime;
            } else { // !needsGCD
                actionList[i].startTime = (actionList[i - 1].startTime || 0) + castTime;
            }
        
            // Always adjust the previous action's time
            actionList[i - 1].timeTaken = (actionList[i].startTime || 0) - (actionList[i - 1].startTime || 0);
        }

        if (i === actionList.length - 1) { // Last Action in Timeline
            // If single action, default to original cast time. Otherwise, use true cast time
            castTime = actionList.length === 1 ? castTime : (actionList[i].castNumeric || 0);
            actionList[i].timeTaken = castTime;
        }
    }
}

export function findTimes(actionList: Action[], GCDTime: number): [Action, number][] {
    let currTime = 0;
    const waitTime = 0.7;

    // Initialize the timed list and tracking variables
    const timedList: [Action, number][] = [];
    const usedActions: Record<string, number> = {}; // Map action names to cooldown expiration times
    let lastGCDTime = 0;

    // Parse numeric values for cast and recast times
    actionList.forEach(action => {
        action.castNumeric = action.cast === "Instant" ? 0 : parseFloat(action.cast || "0");
        action.recastNumeric = parseFloat(action.recast || "0");
        action.isInstant = action.cast === "Instant";
    });

    // Process the first action
    const firstAction = actionList[0];
    currTime = firstAction.isInstant ? waitTime : firstAction.castNumeric!;
    timedList.push([firstAction, currTime]);

    if (firstAction.isWeaponskill || firstAction.isSpell) {
        lastGCDTime = currTime - (firstAction.isInstant ? waitTime : firstAction.castNumeric!);
    }
    usedActions[firstAction.name] = currTime + firstAction.recastNumeric!;

    // Process the rest of the actions
    for (let i = 1; i < actionList.length; i++) {
        const currAction = actionList[i];

        // Ensure the action is not on cooldown
        if (usedActions[currAction.name] && currTime < usedActions[currAction.name]) {
            currTime = usedActions[currAction.name];
        }

        // Handle GCD actions
        if (currAction.isWeaponskill || currAction.isSpell) {
            if (currAction.isInstant) {
                if (currTime <= lastGCDTime + GCDTime && lastGCDTime >= 0) {
                    currTime = lastGCDTime + GCDTime + waitTime;
                } else {
                    currTime += waitTime;
                }
            } else {
                if (currTime <= lastGCDTime + GCDTime && lastGCDTime >= 0) {
                    currTime = lastGCDTime + GCDTime + currAction.castNumeric!;
                } else {
                    currTime += currAction.castNumeric!;
                }
            }
            lastGCDTime = currTime - (currAction.isInstant ? waitTime : currAction.castNumeric!);
        } else {
            // Handle abilities (weavable actions)
            currTime += waitTime;
        }

        // Add to timed list
        timedList.push([currAction, Math.round(currTime * 10) / 10]);

        // Update cooldown tracking
        usedActions[currAction.name] = currTime + currAction.recastNumeric!;
    }

    return timedList;
}


export function getBuffs(timedList: [Action, number][]): any[] {
    let currBuffs: any[] = [];
    let lastAction: Action | null = null;

    for (let i = 0; i < timedList.length; i++) {
        const currAction = timedList[i][0];
        const currTime = timedList[i][1];

        if (hasOwnProperty(currAction, 'damageBuff')) {
            currBuffs.push([currAction, currTime, currTime + (currAction.durationNumeric || 0)]);
        }

        if (hasOwnProperty(currAction, 'grants') && currAction.grantsNumeric) {
            const grantKeys = Object.keys(currAction.grantsNumeric);

            for (let k = 0; k < grantKeys.length; k++) {
                currBuffs.push([
                    grantKeys[k].toLowerCase(),
                    currAction.grantsNumeric[grantKeys[k]],
                    currTime,
                    currTime + 30
                ]);
            }
        }

        if (lastAction && hasOwnProperty(currAction, 'comboBonus') && currAction.comboAction === lastAction.name && currAction.comboBonusNumeric) {
            const comboKeys = Object.keys(currAction.comboBonusNumeric);

            for (let k = 0; k < comboKeys.length; k++) {
                currBuffs.push([
                    comboKeys[k].toLowerCase(),
                    currAction.comboBonusNumeric[comboKeys[k]],
                    currTime,
                    currTime + 30
                ]);
            }
        }

        if (currAction.isSpell || currAction.isWeaponskill) {
            lastAction = currAction;
        }
    }

    return currBuffs;
}

export function calculatePotency(timedList: [Action, number][]): number {
    let currTime = 0;
    let totalPotency = 0;
    let currBuffs = getBuffs(timedList);
    let buffAmt = 1;
    let lastAction: any = {};
    let extraPotency: any = null;
    let stacksUsed = 0;

    for (let i = 0; i < timedList.length; i++) {
        buffAmt = 1;
        let currAction = timedList[i][0];
        currTime = timedList[i][1];

        for (let j = 0; j < currBuffs.length; j++) {
            if (currBuffs[j].length === 3) {
                if (currTime <= currBuffs[j][2] && currTime >= currBuffs[j][1]) {
                    if (hasOwnProperty(currBuffs[j][0], 'damageBuff')) {
                        buffAmt = currBuffs[j][0].damageBuff;
                    } else if (hasOwnProperty(currAction, currBuffs[j][0])) {
                        extraPotency = currBuffs[j][0];
                    }
                }
            }
        }

        if (currAction.isSpell || currAction.isWeaponskill) {
            if (extraPotency != null) {
                totalPotency += currAction[extraPotency] * buffAmt;
                stacksUsed = -1;
            } else if (currAction.comboAction === lastAction.name && hasOwnProperty(currAction, 'comboAction')) {
                totalPotency += (currAction.comboPotencyNumeric || 0) * buffAmt;
            } else if (hasOwnProperty(currAction, 'potency')) {
                totalPotency += (currAction.potencyNumeric || 0) * buffAmt;
            }
            lastAction = currAction;
        }

        if (currAction.isAbility) {
            if (hasOwnProperty(currAction, 'potency')) {
                totalPotency += (currAction.potencyNumeric || 0) * buffAmt;
            }
        }
        extraPotency = null;
    }

    return totalPotency;
}