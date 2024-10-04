import { LightningElement } from 'lwc';
import { getActionInfo, getJobNames, getJobActions } from 'xiv/actionRepository';
import { Action } from 'xiv/actionDataTypes'; // Assuming you have an Action interface

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

        if (actionList[0].cast === 'Instant') {
            currTime = waitTime;
        } else {
            currTime = parseFloat(actionList[0].cast);
        }

        let timedList: [Action, number][] = [[actionList[0], currTime]];
        let usedActions: [string, number][] = [
            [actionList[0].name, parseFloat(actionList[0].recast)]
        ];

        let lastGCD: [string, number] = [actionList[0].name, currTime];
        if (actionList[0].type === 'Ability') {
            lastGCD[1] = -1;
        }

        for (let i = 1; i < actionList.length; i++) {
            const currAction = actionList[i];

            for (let j = 0; j < usedActions.length; j++) {
                if (currAction.name === usedActions[j][0] && currTime < usedActions[j][1]) {
                    currTime = usedActions[j][1];
                }
            }

            if (currAction.type === 'Spell' || currAction.type === 'Weaponskill') {
                if (currAction.cast === 'Instant') {
                    if (currTime <= lastGCD[1] + GCDTime && lastGCD[1] !== -1) {
                        currTime = lastGCD[1] + GCDTime + waitTime;
                    } else {
                        currTime += waitTime;
                    }
                } else {
                    if (currTime <= lastGCD[1] + GCDTime && lastGCD[1] !== -1) {
                        currTime = lastGCD[1] + GCDTime + parseFloat(currAction.cast);
                    } else {
                        currTime += parseFloat(currAction.cast);
                    }
                }
                timedList.push([currAction, Math.round(currTime * 10) / 10]);
                lastGCD = [currAction.name, Math.round(currTime * 10) / 10];
            } else {
                currTime += waitTime;
                timedList.push([currAction, Math.round(currTime * 10) / 10]);
            }

            if (currAction.cast !== 'Instant') {
                if (parseFloat(currAction.recast) >= parseFloat(currAction.cast)) {
                    usedActions.push([currAction.name, currTime]);
                } else {
                    usedActions.push([currAction.name, currTime + parseFloat(currAction.recast)]);
                }
            } else {
                usedActions.push([currAction.name, currTime + parseFloat(currAction.recast)]);
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
                currBuffs.push([currAction, currTime, currTime + parseFloat(currAction.duration || '0')]);
            }

            if (hasOwnProperty(currAction, 'grants') && currAction.grants) {
                for (let k = 0; k < Object.keys(currAction.grants).length; k++) {
                    currBuffs.push([
                        Object.keys(currAction.grants)[k].toLowerCase(),
                        parseFloat(currAction.grants[Object.keys(currAction.grants)[k]]),
                        currTime,
                        currTime + 30
                    ]);
                }
            }

            if (lastAction && hasOwnProperty(currAction, 'comboBonus') && currAction.comboAction === lastAction.name && currAction.comboBonus) {
                for (let k = 0; k < Object.keys(currAction.comboBonus).length; k++) {
                    currBuffs.push([
                        Object.keys(currAction.comboBonus)[k].toLowerCase(),
                        parseFloat(currAction.comboBonus[Object.keys(currAction.comboBonus)[k]]),
                        currTime,
                        currTime + 30
                    ]);
                }
            }

            if (currAction.type === 'Spell' || currAction.type === 'Weaponskill') {
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
                            buffAmt = parseFloat(currBuffs[j][0].damageBuff);
                        } else if (hasOwnProperty(currAction, currBuffs[j][0])) {
                            extraPotency = currBuffs[j][0];
                        }
                    }
                }
            }

            if (currAction.type === 'Spell' || currAction.type === 'Weaponskill') {
                if (extraPotency != null) {
                    totalPotency += parseFloat(currAction[extraPotency]) * buffAmt;
                    stacksUsed = -1;
                } else if (currAction.comboAction === lastAction.name && hasOwnProperty(currAction, 'comboAction')) {
                    totalPotency += parseFloat(currAction.comboPotency || '0') * buffAmt;
                } else if (hasOwnProperty(currAction, 'potency')) {
                    totalPotency += parseFloat(currAction.potency || '0') * buffAmt;
                }
                lastAction = currAction;
            }

            if (currAction.type === 'Ability') {
                if (hasOwnProperty(currAction, 'potency')) {
                    totalPotency += parseFloat(currAction.potency || '0') * buffAmt;
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
            timedList.forEach((timedAction, i) => {
                const castTime = timedAction[0].cast === 'Instant' ? 0.7 : parseFloat(timedAction[0].cast);
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

            this.calculatePotency(timedList);
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
