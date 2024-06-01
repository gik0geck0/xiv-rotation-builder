import { LightningElement, api } from "lwc";
import { getActionInfo } from 'xiv/actionRepository';
import { getJobActions } from 'xiv/actionRepository';

export default class IconTray extends LightningElement {
    @api job;
    @api actionList;

    jobActions = getJobActions("paladin");

    addAction(e){
        let tempActionList = [...this.actionList];
        const listElements = [...this.template.querySelectorAll("xiv-job-icon")];
        const currentIndex = listElements.findIndex((e) => e == e.target);
        console.log(getActionInfo("paladin", e.target.name));
        tempActionList.push(getActionInfo("paladin", e.target.name));
        console.log(tempActionList);
        this.actionList = tempActionList;
    }
}