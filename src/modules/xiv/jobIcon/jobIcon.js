import { LightningElement, api } from "lwc";

export default class JobIcon extends LightningElement {

    @api name;
    @api location = "tray";
    @api jobAbv;
    @api type = "";
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
            if(this.type == "Ability"){
                return "height:50px; width:50px; margin:0px; padding:5px;";
            }
            else{
                return "height:70px; width:70px; margin:0px; padding:5px; margin-top:30px";
            }
            
        }
    }

    get liComputedSize(){
        if(this.location == "tray"){
            return "cursor: grab; display: inline; height: 80px; width: 80; margin: 10px; padding: 10px;";
        }
        else if (this.location == "selected"){
            return "cursor: grab; display: inline-flex; height:70px; width:70px; margin:0px; padding:0px; margin-bottom: 40px; background: red; vertical-align: bottom; border";
        }
        else if (this.location == 'invalid'){
            return "cursor: grab; display: inline-flex; height: 80px; width: 80; margin: 10px; padding: 10px; background: red;";
        }
        else{
            return "cursor: grab; display: inline-flex; height:70px; width:70px; margin:0px; padding:0px; margin-bottom: 40px; vertical-align: bottom;";
        }
    }
}