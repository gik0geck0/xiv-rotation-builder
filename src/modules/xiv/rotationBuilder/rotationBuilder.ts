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
    timeActionList(actionList, timedList);
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
    const timedList = findTimes(actionList, gcdTime);
    const totalTime = timedList.reduce((sum, [, time]) => sum + time, 0);
    return totalTime;
}

export function timeActionList(actionList: Action[], timedList: [Action, number][]): void {
    timedList.forEach((timedAction, i) => {
        const castTime = timedAction[0].isInstant ? 0.7 : (timedAction[0].castNumeric || 0);
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
}

export function findTimes(actionList: Action[], GCDTime: number): [Action, number][] {
    let currTime = 0;
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