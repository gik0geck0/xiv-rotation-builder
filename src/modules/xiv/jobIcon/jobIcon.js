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
        //TODO: Rewrite into CSS classes
        if(this.location == "tray"){
            return "height:35px; width:35px; margin:5px; padding:0px;";;
        }
        else{
            if(this.type == "Ability"){
                return "height:50px; width:50px; margin:0px; padding:5px; vertical-align: top; ";
            }
            else{
                return "height:70px; width:70px; margin:0px; padding:5px; ";
            }
            
        }
    }

    get liComputedSize(){
        //TODO: Rewrite into CSS classes
        if(this.location == "tray"){
            return "cursor: grab; display: inline; height: 80px; width: 80px; margin: 10px; padding: 10px;";
        }
        else if (this.location == "selected"){
            if(this.type == "Ability"){
                return "cursor: grab; display: inline-flex; height:50px; width:50px; margin:0px; padding:0px; background: skyblue; vertical-align: top; margin-top: 10px;";
            }
            else{
                return "cursor: grab; display: inline-flex; height:70px; width:70px; margin:0px; padding:0px; background: skyblue; margin-top: 30px;";
            }
        }
        else if (this.location == "invalid"){
            if(this.type == "Ability"){
                return "cursor: grab; display: inline-flex; height:50px; width:50px; margin:0px; padding:0px; background: red; vertical-align: top; margin-top: 10px;";
            }
            else{
                return "cursor: grab; display: inline-flex; height:70px; width:70px; margin:0px; padding:0px; background: red; margin-top: 30px;";
            }
        }
        else{
            if(this.type == "Ability"){
                return "cursor: grab; display: inline-flex; height:50px; width:50px; margin:0px; padding:0px; vertical-align: top;  margin-top: 10px;";
            }
            else{
                return "cursor: grab; display: inline-flex; height:70px; width:70px; margin:0px; padding:0px; margin-top: 30px;";
            }
        }
    }
}