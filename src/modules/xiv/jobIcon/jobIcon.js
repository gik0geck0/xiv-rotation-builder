import { LightningElement, api } from "lwc";

export default class JobIcon extends LightningElement {
    @api starttime = 0;
    @api timetaken = 0.7;
    @api name;
    @api location = "tray";
    @api jobAbv;
    @api type = "";
    @api actionId;
    @api hoverText;
    gcdLength = 2.5;
    tenthOfASecondToPixelRatio = 100;
    // onclick
    // ondelete
    // ondrag?

    get url() {
        return `/assets/icons/xiv/${this.jobAbv}/${this.actionId}.png`;
    }

    get imgComputedSize() {
        //TODO: Rewrite into CSS classes
        if(this.location == "tray"){
            return "height:35px; width:35px; margin:5px; padding:0px;";
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
        let width = this.timetaken*this.tenthOfASecondToPixelRatio;
        if(this.location == "tray"){
            return "cursor: grab; display: inline; height: 35px; width: 35px; margin: 10px; padding: 10px;";
        }
        //If it is selected, make the size correct and make it blue
        else if (this.location == "selected"){
            //makes smaller image, and pushes it up for an ability
            if(this.type == "Ability"){
                return `cursor: grab; display: inline-flex; height:50px; width:${width}px; margin:0px; padding:0px; background: skyblue; vertical-align: top; margin-top: 10px;`;
            }
            //Larger and centered image for GCD actions
            else{
                return `cursor: grab; display: inline-flex; height:70px; width:${width}px; margin:0px; padding:0px; background: skyblue; margin-top: 30px; position:relative;`;
            }
        }
        //If it has an error, make the size correct and make it red
        else if (this.location == "invalid"){
            if(this.type == "Ability"){
                return `cursor: grab; display: inline-flex; height:50px; width:${width}px; margin:0px; padding:0px; background: red; vertical-align: top; margin-top: 10px;`;
            }
            else{
                return `cursor: grab; display: inline-flex; height:70px; width:${width}px; margin:0px; padding:0px; background: red; margin-top: 30px; position:relative;`;
            }
        }
        //Normal case for the list if not invalid or selected
        else{
            if(this.type == "Ability"){
                return `cursor: grab; display: inline-flex; height:50px; width:${width}px; margin:0px; padding:0px; vertical-align: top;  margin-top: 10px;`;
            }
            else{
                return `cursor: grab; display: inline-flex; height:70px; width:${width}px; margin:0px; padding:0px; margin-top: 30px; position:relative;`;
            }
        }
    }


    get gcdComputedSize(){
        if(this.location == "list"){
            if(this.type != "Ability"){
                return `width: ${(this.gcdLength-0.7)*this.tenthOfASecondToPixelRatio}px; height: 20px; background: green; visibility: visible; z-index: 1; position:absolute; left:${0.7*this.tenthOfASecondToPixelRatio}px; bottom: 5px;`;
            }
            else{
                return "visibility: hidden;";
            }
        }
    }

}