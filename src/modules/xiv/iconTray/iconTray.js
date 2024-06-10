import { LightningElement, api } from "lwc";
import { getJobActions } from 'xiv/actionRepository';

export default class IconTray extends LightningElement {
    @api job = "paladin";
    @api jobActions = getJobActions("paladin");

    displayDetails(e){
        this.dispatchEvent(new CustomEvent('displaydetail', {detail: {actionName: e.target.name, actionDescription: e.target.hovertext}}));
    }

    addAction(e){
        this.dispatchEvent(new CustomEvent('addaction', {detail: {actionName: e.target.name}}));
    }
}