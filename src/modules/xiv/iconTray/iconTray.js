import { LightningElement, api } from "lwc";
import { getActionInfo } from 'xiv/actionRepository';
import { getJobActions } from 'xiv/actionRepository';

export default class IconTray extends LightningElement {
    @api job;

    jobActions = getJobActions("paladin");

    addAction(e){
        const listElements = [...this.template.querySelectorAll("xiv-job-icon")];
        const currentIndex = listElements.findIndex((e) => e == e.target);
        this.dispatchEvent(new CustomEvent('addaction', {detail: {actionName: e.target.name}}));
    }
}