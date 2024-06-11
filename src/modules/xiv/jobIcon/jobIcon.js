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

        //If in the tray, make it the smaller image size
        if(this.location == "tray"){
            return "cursor: grab; display: inline; height: 35px; width: 35px; margin: 10px; padding: 10px;";
        }
        //If it is selected, make the size correct and make it blue
        else if (this.location == "selected"){
            //makes smaller image, and pushes it up for an ability
            if(this.type == "Ability"){
                return "cursor: grab; display: inline-flex; height:50px; width:50px; margin:0px; padding:0px; background: skyblue; vertical-align: top; margin-top: 10px;";
            }
            //Larger and centered image for GCD actions
            else{
                return "cursor: grab; display: inline-flex; height:70px; width:70px; margin:0px; padding:0px; background: skyblue; margin-top: 30px;";
            }
        }
        //If it has an error, make the size correct and make it red
        else if (this.location == "invalid"){
            if(this.type == "Ability"){
                return "cursor: grab; display: inline-flex; height:50px; width:50px; margin:0px; padding:0px; background: red; vertical-align: top; margin-top: 10px;";
            }
            else{
                return "cursor: grab; display: inline-flex; height:70px; width:70px; margin:0px; padding:0px; background: red; margin-top: 30px;";
            }
        }
        //Normal case for the list if not invalid or selected
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