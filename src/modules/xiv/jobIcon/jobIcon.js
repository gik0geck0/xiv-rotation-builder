import { LightningElement, api } from "lwc";

export default class JobIcon extends LightningElement {

    @api jobAbv;
    @api actionId;
    @api hoverText;

    // onclick
    // ondelete
    // ondrag?

    get url() {
        return `/assets/icons/xiv/${this.jobAbv}/${this.actionId}.png`;
    }

    get computedSize() {
        return "height:75px;margin:10px;"
    }
}