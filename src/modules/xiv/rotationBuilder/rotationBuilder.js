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
        let currTime = 0;
        //Calculation
        let totalPotency = 0;
        let currBuffs = [];
        let buffAmt = 1;
        let lastAction = {};
        let extraPotency = null;
        let stacksUsed = 0;
        //Go through every item in the list
        for (let i = 0; i < actionList.length; i++ ){
            buffAmt = 1;
            let currAction = actionList[i]
            //check if it starts a % based buff
            if(currAction.hasOwnProperty("buff")){
                currBuffs.push([currAction,currTime,currTime+parseInt(currAction.duration)])
            }
            //check if it grants anything
            if(currAction.hasOwnProperty("grants")){
                for(let k = 0; k <Object.keys(currAction.grants).length; k++){
                    currBuffs.push([Object.keys(currAction.grants)[k], parseInt((currAction.grants[Object.keys(currAction.grants)[k]]))])
                }
            }
            //goes through the list of buffs to see if any are active
            for(let j = 0; j<currBuffs.length; j++ ){
                //3 length means a start and end time
                if(currBuffs[j].length == 3){
                    if(currTime <= currBuffs[j][2]){
                        buffAmt = parseFloat(currBuffs[j][0].buff);
                    }
                }
                //2 length means a stack based buff
                else{
                    currBuffs[j][1] += stacksUsed;
                    if(currBuffs[j][1] >= 1){
                        extraPotency = currBuffs[j][0];
                    }
                    stacksUsed = 0;
                }
            }
            //loop for GCD Actions
            if(currAction.type == "Spell" || currAction.type == "Weaponskill"){
                //if there is a special potency
                if(extraPotency != null && currAction.hasOwnProperty([extraPotency])){
                    totalPotency += (parseInt(currAction[extraPotency])) * buffAmt;
                    stacksUsed = -1;
                }
                //if there is a combo potency
                else if(currAction.comboAction == lastAction.name && currAction.hasOwnProperty("comboAction")){
                    totalPotency += (parseInt(currAction.comboPotency)) * buffAmt;
                }
                //normal potency
                else{
                    totalPotency += (parseInt(currAction.potency)) * buffAmt;
                }
                //save the last action for combo checking
                lastAction = currAction;
                currTime += 2.5;
            }
            //if non-GCD and it has a potency, add that potency
            if (currAction.type == "Ability"){
                if(currAction.hasOwnProperty("potency")){
                    totalPotency += (parseInt(currAction.potency)) * buffAmt;
                }
            }
            //reset extra potency
            extraPotency = null;
        }

        console.log(totalPotency)
        this.template.querySelector('lightning-card.potencyLabel').title="Potency: " + totalPotency;
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
