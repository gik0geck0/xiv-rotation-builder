// iconTray.ts
import { LightningElement, api } from 'lwc';
import { getJobActions } from 'xiv/actionRepository';
import type { Action } from 'xiv/actionData';

export default class IconTray extends LightningElement {
    @api job: string = 'paladin';
    @api jobActions: Action[] = getJobActions('paladin');

    displayDetails(e: Event) {
        const target = e.target as any;
        this.dispatchEvent(
            new CustomEvent('displaydetail', {
                detail: {
                    actionName: target.name,
                    actionDescription: target.hovertext
                }
            })
        );
    }

    addAction(e: Event) {
        const target = e.target as any;
        this.dispatchEvent(
            new CustomEvent('addaction', {
                detail: { actionName: target.name }
            })
        );
    }
}
