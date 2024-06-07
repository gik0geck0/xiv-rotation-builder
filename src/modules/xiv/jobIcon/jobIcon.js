import { LightningElement, api } from "lwc";

export default class JobIcon extends LightningElement {

    @api name;
    @api location = "tray";
    @api jobAbv;
    @api actionId;
    @api hoverText;

    // onclick
    // ondelete
    // ondrag?

    get url() {
        return `/assets/icons/xiv/${this.jobAbv}/${this.actionId}.png`;
    }

    get imgComputedSize() {
        if(this.location == "tray"){
            return "height:35px; width:35px; margin:0px; padding:0px;";;
        }
        else{
            return "height:70px; width:70px; margin:0px; padding:0px;";
        }
    }

    get liComputedSize(){
        if(this.location == "tray"){
            return "cursor: grab; display: inline; height: 80px; width: 80; margin: 10px; padding: 10px;";
        }
        else if (this.location == "selected"){
            return "cursor: grab; display: inline-flex; height: 80px; width: 80; margin: 10px; padding: 10px; background: blue;";
        }
        else{
            return "cursor: grab; display: inline-flex; height: 80px; width: 80; margin: 10px; padding: 10px;";
        }
    }
}