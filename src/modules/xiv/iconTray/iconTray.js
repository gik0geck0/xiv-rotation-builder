import { LightningElement, api } from 'lwc';
import { getJobActions } from 'xiv/actionRepository';

export default class IconTray extends LightningElement {
    //sets the job at the start
    @api job = 'paladin';
    @api jobActions = getJobActions('paladin');

    displayDetails(e) {
        //Function to display information about a skill
        this.dispatchEvent(
            new CustomEvent('displaydetail', {
                detail: {
                    actionName: e.target.name,
                    actionDescription: e.target.hovertext
                }
            })
        );
    }

    addAction(e) {
        //function to add an action
        this.dispatchEvent(
            new CustomEvent('addaction', {
                detail: { actionName: e.target.name }
            })
        );
    }
}
