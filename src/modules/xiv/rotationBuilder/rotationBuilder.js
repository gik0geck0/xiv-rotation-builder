import { LightningElement } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';


export default class HelloWorldApp extends LightningElement {
    buffComboActionList = ["Fast Blade", "Fight or Flight", "Riot Blade"].map(getActionInfo.bind(undefined, "paladin"));
    buffActionList = [ "Fight or Flight", "Riot Blade","Fast Blade",].map(getActionInfo.bind(undefined, "paladin"));
    comboActionList = ["Fast Blade", "Riot Blade", "Fight or Flight"].map(getActionInfo.bind(undefined, "paladin"));
    pldjob = "paladin";

	addHolySpirit() {
		//this.mockActionList.push(getActionInfo(this.job, "Holy Spirit"));
        console.log("ye")
	}

    calcWithVals(){
        this.calculatePotency(this.buffComboActionList,this.pldjob);
    }

    calculatePotency(actionList, job){

        let currTime = 1
        //Calculation
        console.log(actionList);
        let totalPotency = 0;
        let GCDPotency = 0;
        let currBuffs = [];
        for (let i = 0; i < actionList.length; i++ ){
            let currAction = actionList[i]
            if(currAction.hasOwnProperty("buff")){
                currBuffs.push([currAction.name,currTime,currTime+parseInt(currAction.buffDur)])
            }
            for(let j = 0; j<currBuffs.length; j++ ){

            }
            currTime += 21
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