import { LightningElement } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';

export default class HelloWorldApp extends LightningElement {

    //starting action list
    mockActionList = [].map(getActionInfo.bind(undefined, "paladin"));
    job = "paladin";

    //using the calc with the different
    calcWithList(){
        
        this.calculatePotency(this.mockActionList,this.job);
    }
    

    calculatePotency(actionList, job){
        console.log(actionList);
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
                currBuffs.push([currAction,currTime,currTime+parseInt(currAction.duration)])
            }
            if(currAction.hasOwnProperty("grants")){
                for(let k = 0; k <Object.keys(currAction.grants).length; k++){
                    currBuffs.push([Object.keys(currAction.grants)[k], parseInt((currAction.grants[Object.keys(currAction.grants)[k]]))])
                }
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
        }

        console.log(totalPotency)
    }


	addHolySpirit() {
		this.mockActionList.push(getActionInfo(this.job, "Holy Spirit"));
		this.mockActionList = [...this.mockActionList];
	}

	addTimelineAction(e) {
		this.mockActionList.push(getActionInfo(this.job, e.detail.actionName));
		this.mockActionList = [...this.mockActionList];
	}

	removeAction(e){
		console.log(e.detail.indexToRemove);
		this.mockActionList.splice(e.detail.indexToRemove, 1);
		this.mockActionList = [...this.mockActionList];
	}

	spliceTimelineAction(e) {
		const movedItem = this.mockActionList.splice(e.detail.currentIndex, 1)[0];
		this.mockActionList.splice(e.detail.destinationIndex, 0, movedItem);
		this.mockActionList = [...this.mockActionList];
	}
}
