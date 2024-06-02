import { LightningElement } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';


export default class HelloWorldApp extends LightningElement {
    buffComboActionList = ["Fast Blade", "Requiescat", "Holy Spirit"].map(getActionInfo.bind(undefined, "paladin"));
    buffActionList = [ "Fight or Flight", "Riot Blade","Fast Blade",].map(getActionInfo.bind(undefined, "paladin"));
    comboActionList = ["Fast Blade", "Riot Blade", "Fight or Flight"].map(getActionInfo.bind(undefined, "paladin"));
    pldjob = "paladin";

	addHolySpirit() {
		//this.mockActionList.push(getActionInfo(this.job, "Holy Spirit"));
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
        let extraPotency = null;
        let stacksUsed = 0;
        for (let i = 0; i < actionList.length; i++ ){
            buffAmt = 1;
            let currAction = actionList[i]
            if(currAction.hasOwnProperty("buff")){
                currBuffs.push([currAction,currTime,currTime+parseInt(currAction.buffDur)])
            }
            if(currAction.hasOwnProperty("grants")){
                currBuffs.push([currAction.grants, parseInt(currAction.grantstack)])
            }
            for(let j = 0; j<currBuffs.length; j++ ){
                if(currBuffs[j].length == 3){
                    if(currTime <= currBuffs[j][2]){
                        buffAmt = parseFloat(currBuffs[j][0].buff);
                    }
                }
                else{
                    currBuffs[j][1] += stacksUsed;
                    if(currBuffs[j][1] >= 1){
                        extraPotency = currBuffs[j][0];
                    }
                    stacksUsed = 0;
                }
            }
            if(isNaN(buffAmt)){
                buffAmt = 1;
            }

            if(currAction.type == "Spell" || currAction.type == "Weaponskill"){
                if(extraPotency != null && currAction.hasOwnProperty([extraPotency])){
                    totalPotency += (parseInt(currAction[extraPotency])) * buffAmt;
                    stacksUsed = -1;
                }
                else if(currAction.comboAction == lastAction.name && currAction.hasOwnProperty("comboAction")){
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

            extraPotency = null;
            currTime += 11
        }

        console.log(totalPotency)
    }
}