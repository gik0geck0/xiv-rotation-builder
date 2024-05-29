import { LightningElement } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';


export default class HelloWorldApp extends LightningElement {
    mockActionList = ["Holy Spirit", "Holy Spirit", "Holy Spirit"].map(getActionInfo.bind(undefined, "pld"));
    pldjob = "pld";

	addHolySpirit() {
		//this.mockActionList.push(getActionInfo(this.job, "Holy Spirit"));
        console.log("ye")
	}

    calcWithVals(){
        this.calculatePotency(this.mockActionList,this.pldjob);
    }

    calculatePotency(actionList, job){


        //Calculation
        
        let totalPotency = 0;
        let GCDPotency = 0;
        let currBuffs = [];
        for (let i = 0; i < actionList.length; i++ ){
            let currAction = actionList[i].getActionInfo(actionList[i], job);
            console.log(currAction)
            /*
            //first check if it activates any buff
            if(currAction.getAdditionalEffect().contains("Grants")){
                //add the buff to the list
                currBuffs.push(currAction.getAdditionalEffect(), currAction.duration());
            }
            //if it is a spell or weaponskill, assume it is a new GCD
            if(currAction[type] == "spell" || currAction[type] == "weaponskill"){
                totalPotency += GCDPotency;
                GCDPotency = 0;
                //check vs last action to see if it is a combo
                if(currAction[comboAction] == lastAction[id]){
                    GCDPotency = currAction[comboPotency];
                }
                else{
                    GCDPotency = currAction[potency];
                }
    
                lastAction = currAction;
            }
            else if (currAction[type] == "ability"){
                //weavable
    
                //see if it activates a buff
    
                //if not just add the potency to the GCD Potency
                GCDPotency += currAction.getPotency();
            }
            else if (currAction == "wait"){
                //decrease buff durations
            }
    
            //decrease buff time and delete the buffs if they end
            currBuffs.forEach(element => {
                element.duration() -= GCDTime
                if(element.duration() <=0){
                    currBuffs.pop(element);
                }
            });*/
        }
    }
}