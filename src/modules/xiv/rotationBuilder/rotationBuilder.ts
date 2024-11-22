import { LightningElement } from 'lwc';
import { getActionInfo, getJobNames, getJobActions } from 'xiv/actionRepository';
import type { Action } from 'xiv/actionData'; // Assuming you have an Action interface
import { validateActions } from './rotationBuilderUtil';
import { JobGuide } from 'xiv/actionData';

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