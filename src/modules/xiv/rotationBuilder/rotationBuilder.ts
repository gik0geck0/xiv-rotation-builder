import { LightningElement } from 'lwc';
import { getActionInfo, getJobNames, getJobActions } from 'xiv/actionRepository';
import type { Action } from 'xiv/actionData'; // Assuming you have an Action interface
import { JobGuide } from 'xiv/actionData';

function hasOwnProperty(obj: any, property: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, property);
}

export default class RotationBuilder extends LightningElement {
    job: string = 'paladin';
    jobActions: Action[] = getJobActions(this.job);
    totalPotency: number = 0;
    mockActionList: Action[] = [].map(() => getActionInfo('paladin', '')).filter((action): action is Action => action !== undefined);
    jobList: string[] = getJobNames() as string[];
    skillDetails: string = '';
    errorDetails: string = '';

    changeJob() {
        this.job = (this.template?.querySelector('select') as HTMLSelectElement).value;
        this.mockActionList = [].map(() => getActionInfo(this.job, '')).filter((action): action is Action => action !== undefined);
        this.jobActions = getJobActions(this.job);
    }

    findTimes(actionList: Action[]): [Action, number][] {
        let currTime = 0;
        const GCDTime = 2.5;
        const waitTime = 0.7;

        if (actionList[0].isInstant) {
            currTime = waitTime;
        } else {
            currTime = (actionList[0].castNumeric || 0);
        }

        let timedList: [Action, number][] = [[actionList[0], currTime]];
        let usedActions: [string, number][] = [
            [actionList[0].name, (actionList[0].recastNumeric || 0)]
        ];

        let lastGCD: [string, number] = [actionList[0].name, currTime];
        if (actionList[0].isAbility) {
            lastGCD[1] = -1;
        }

        for (let i = 1; i < actionList.length; i++) {
            const currAction = actionList[i];

            for (let j = 0; j < usedActions.length; j++) {
                if (currAction.name === usedActions[j][0] && currTime < usedActions[j][1]) {
                    currTime = usedActions[j][1];
                }
            }

            if (currAction.isSpell || currAction.isWeaponskill) {
                if (currAction.isInstant) {
                    if (currTime <= lastGCD[1] + GCDTime && lastGCD[1] !== -1) {
                        currTime = lastGCD[1] + GCDTime + waitTime;
                    } else {
                        currTime += waitTime;
                    }
                } else {
                    if (currTime <= lastGCD[1] + GCDTime && lastGCD[1] !== -1) {
                        currTime = lastGCD[1] + GCDTime + (currAction.castNumeric || 0);
                    } else {
                        currTime += (currAction.castNumeric || 0);
                    }
                }
                timedList.push([currAction, Math.round(currTime * 10) / 10]);
                lastGCD = [currAction.name, Math.round(currTime * 10) / 10];
            } else {
                currTime += waitTime;
                timedList.push([currAction, Math.round(currTime * 10) / 10]);
            }

            if (!currAction.isInstant) {
                if ((currAction.recastNumeric || 0) >= (currAction.castNumeric || 0)) {
                    usedActions.push([currAction.name, currTime]);
                } else {
                    usedActions.push([currAction.name, currTime + (currAction.recastNumeric || 0)]);
                }
            } else {
                usedActions.push([currAction.name, currTime + (currAction.recastNumeric || 0)]);
            }
        }

        return timedList;
    }

    getBuffs(timedList: [Action, number][]): any[] {
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

    calculatePotency(timedList: [Action, number][]): void {
        let currTime = 0;
        let totalPotency = 0;
        let currBuffs = this.getBuffs(timedList);
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

        const PPS = Math.round((totalPotency / currTime) * 100) / 100;
        (this.template?.querySelector('lightning-card.potencyLabel') as HTMLElement).title =
            `Total Potency: ${totalPotency}`;
        (this.template?.querySelector('lightning-card.ppsLabel') as HTMLElement).title =
            `Potency Per Second: ${PPS}`;
    }

    validation(actionList: Action[], job: string): void {
        // Initializing the action list
        actionList.forEach(action => {
            action.location = 'list';
            action.errorMessage = '';
        });
    
        if (actionList.length === 0) {
            (this.template?.querySelector('lightning-card.potencyLabel') as HTMLElement).title =
                'Total Potency: Add actions to receive a potency.';
            (this.template?.querySelector('lightning-card.ppsLabel') as HTMLElement).title =
                'Potency Per Second: Add actions to receive a pps.';
        } else {
            const timedList = this.findTimes(actionList);
    
            // Setting startTime and timeTaken for each action in the timed list
            timedList.forEach((timedAction, i) => {
                let castTime = timedAction[0].cast === 'Instant' ? 0.7 : parseFloat(timedAction[0].cast || '0.7');
                
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
    
            // Validation check
            const invalidActionList: [Action, number, string][] = [];
            const buffList = this.getBuffs(timedList);
    
            timedList.forEach((timedAction, i) => {
                const currAction = timedAction[0];
    
                // Checking gauge requirements
                gaugeAmounts.forEach((gauge, j) => {
                    const gaugeName = Object.keys(gauge)[0];
                    const newGaugeValue = currAction.cast === 'Instant'
                        ? 5 * Math.floor((timedAction[1] - 0.7) / 2.5)
                        : 5 * Math.floor((timedAction[1] - parseFloat(currAction.cast || '0')) / 2.5);
    
                    gaugeAmounts[j][gaugeName] = newGaugeValue;
    
                    if (currAction.hasOwnProperty(gaugeName)) {
                        if ((gaugeAmounts[j][gaugeName] + currAction[gaugeName]) < 0) {
                            invalidActionList.push([
                                currAction,
                                i,
                                `Not enough ${gaugeName} to cast ${currAction.name}.`
                            ]);
                        } else {
                            gauge[gaugeName] += currAction[gaugeName];
                        }
                    }
                });
    
                // Buff requirement check
                if (currAction.hasOwnProperty('buffRequirement')) {
                    let buffCheck = 0;
    
                    buffList.forEach(buff => {
                        if (buff[0] === currAction.buffRequirement) {
                            buffCheck++;
                            if (buff.length === 4) {
                                if (timedAction[1] < buff[2] || timedAction[1] > buff[3]) {
                                    invalidActionList.push([
                                        currAction,
                                        i,
                                        `${currAction.buffRequirement} is not active at this time to cast ${currAction.name}`
                                    ]);
                                } else if (buff[1] < 1) {
                                    invalidActionList.push([
                                        currAction,
                                        i,
                                        `You are missing stacks of the ${currAction.buffRequirement} to cast ${currAction.name}.`
                                    ]);
                                } else {
                                    buff[1] -= 1;
                                }
                            } else {
                                if (timedAction[1] < buff[1] || timedAction[1] > buff[2]) {
                                    invalidActionList.push([
                                        currAction,
                                        i,
                                        `${currAction.buffRequirement} is not active at this time to cast ${currAction.name}`
                                    ]);
                                }
                            }
                        }
                    });
    
                    if (buffCheck < 1) {
                        invalidActionList.push([
                            currAction,
                            i,
                            `${currAction.buffRequirement} is not active at this time to cast ${currAction.name}`
                        ]);
                    }
                }
            });
    
            // Handle invalid actions
            if (invalidActionList.length > 0) {
                (this.template?.querySelector('lightning-card.potencyLabel') as HTMLElement).title =
                    'Total Potency: Unable to calculate potency with invalid action(s).';
                (this.template?.querySelector('lightning-card.ppsLabel') as HTMLElement).title =
                    'Potency Per Second: Unable to calculate pps with invalid action(s).';
    
                invalidActionList.forEach(invalidAction => {
                    const [action, index, message] = invalidAction;
                    actionList[index].location = 'invalid';
                    actionList[index].errorMessage = message;
                });
            } else {
                // Run the calculation if valid
                this.calculatePotency(timedList);
            }
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