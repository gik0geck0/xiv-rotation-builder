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

    calcWithBoth(){
        
        this.calculatePotency(this.buffComboActionList,this.pldjob);
    }
    calcWithBuff(){
        
        this.calculatePotency(this.buffActionList,this.pldjob);
    }
    calcWithCombo(){
        
        this.calculatePotency(this.comboActionList,this.pldjob);
    }

    calculatePotency(actionList, job){

        let currTime = 1
        //Calculation
        let totalPotency = 0;
        let currBuffs = [];
        let buffAmt = 1;
        let lastAction = {};
        for (let i = 0; i < actionList.length; i++ ){
            buffAmt = 1;
            let currAction = actionList[i]
            if(currAction.hasOwnProperty("buff")){
                currBuffs.push([currAction,currTime,currTime+parseInt(currAction.buffDur)])
            }
            for(let j = 0; j<currBuffs.length; j++ ){
                if(currTime <= currBuffs[j][2]){
                    buffAmt = parseFloat(currBuffs[j][0].buff);
                }
            }
            if(isNaN(buffAmt)){
                buffAmt = 1;
            }

            if(currAction.type == "Spell" || currAction.type == "Weaponskill"){
                if(currAction.comboAction == lastAction.name && currAction.hasOwnProperty("comboAction")){
                    totalPotency += (parseInt(currAction.comboPotency)) * buffAmt;
                }
                else{
                    totalPotency += (parseInt(currAction.potency)) * buffAmt;
                }
                lastAction = currAction;
            }
            if (currAction.type == "Ability"){
                if(currAction.hasOwnProperty("potency")){
                    totalPotency += (parseInt(currAction.potency)) * buffAmt;
                }
            }


            currTime += 11
        }

        console.log(totalPotency)
    }
}