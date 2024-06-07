import { LightningElement } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';
import { getJobNames } from 'xiv/actionRepository';

import { JobGuide } from "xiv/actionData";

console.log(JobGuide)

export default class HelloWorldApp extends LightningElement {
	job = "paladin";
	mockActionList = [].map(getActionInfo.bind(undefined, "paladin"));

    //using the calc with the different
    calcWithList(){
        let timedList = this.findTimes(this.mockActionList);
        //Validation check
        if (invalidList.length === 0){
            this.calculatePotency(timedList,this.job);
        }
        else{
            console.log(invalidList)
        }
    }
    
    findTimes(actionList){
        let currTime = 0;
        let timedList = [[actionList[0],currTime]];
        //time when you can use the skill again
        let usedActions = [[actionList[0].name, currTime+parseFloat(actionList[0].recast)]];
        let lastGCD = [actionList[0].name, 0];
        if(actionList[0].type == "Ability"){
            lastGCD[1] = -1;
        }
        for(let i = 1; i < actionList.length; i++){
            let currAction = actionList[i];
            //if on CD
            for(let j = 0; j < usedActions.length; j++){
                if(currAction.name == usedActions[j][0] && currTime < usedActions[j][1]){
                    currTime = usedActions[j][1];
                }
            }
            //normal time incrementing logic
            if(currAction.type == "Spell" || currAction.type == "Weaponskill"){
                currTime += 0.7;
                if(currTime <= lastGCD[1]+2.5 && lastGCD[1] != -1){
                    currTime = lastGCD[1]+2.5
                }
                let currPair = [currAction,(Math.round(currTime*10)/10)];
                timedList.push(currPair);
                lastGCD = currPair;
            }
            else{
                currTime += 0.7;
                let currPair = [currAction,(Math.round(currTime*10)/10)];
                timedList.push(currPair);
            }
            usedActions.push([currAction.name, currTime + parseFloat(currAction.recast)]);

            

        }
        return timedList;
        
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
            let currAction = actionList[i][0];
            let currTime = actionList[i][1];

            //check if it starts a % based buff
            if(currAction.hasOwnProperty("damageBuff")){
                currBuffs.push([currAction,currTime,currTime+parseInt(currAction.duration)])
            }
            //check if it grants anything
            if(currAction.hasOwnProperty("grants")){
                for(let k = 0; k <Object.keys(currAction.grants).length; k++){
                    if(parseInt((currAction.grants[Object.keys(currAction.grants)[k]])) != -1){
                        currBuffs.push([Object.keys(currAction.grants)[k].toLowerCase(), parseInt((currAction.grants[Object.keys(currAction.grants)[k]]))])
                    }
                    else{
                        currBuffs.push([Object.keys(currAction.grants)[k].toLowerCase(), currTime, currTime+parseFloat(currAction.duration)])
                    }
                }
            }
            //goes through the list of buffs to see if any are active
            for(let j = 0; j<currBuffs.length; j++ ){
                //3 length means a start and end time
                if(currBuffs[j].length == 3){
                    if(currTime <= currBuffs[j][2]){
                        if(currBuffs[j][0].hasOwnProperty("damageBuff")){
                            buffAmt = parseFloat(currBuffs[j][0].damageBuff);
                        }
                        else{
                            extraPotency = currBuffs[j][0];
                        }
                        
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
                    if(currAction.hasOwnProperty("comboBonus")){
                        for(let k = 0; k <Object.keys(currAction.comboBonus).length; k++){
                            if(parseInt((currAction.comboBonus[Object.keys(currAction.comboBonus)[k]])) != -1){
                                currBuffs.push([Object.keys(currAction.comboBonus)[k].toLowerCase(), parseInt((currAction.comboBonus[Object.keys(currAction.comboBonus)[k]]))])
                            }
                            else{
                                currBuffs.push([Object.keys(currAction.comboBonus)[k].toLowerCase(), currTime, currTime+parseFloat(currAction.duration)])
                            }
                        }
                    }
                }
                //normal potency
                else{
                    totalPotency += (parseInt(currAction.potency)) * buffAmt;
                }
                //save the last action for combo checking
                lastAction = currAction;
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
        this.template.querySelector('lightning-card.potencyLabel').title="Potency: " + totalPotency;
    }

	validation(actionList, job){
        var gaugeAmounts = []

        //Adding initial gauge amounts to a list so they can be tracked
        for (let i = 0; i < Object.keys(JobGuide[job].gauges).length; i++){
            var currGauge = Object.keys(JobGuide[job].gauges)[i]
            gaugeAmounts.push({[currGauge] : 0})
        }

        var invalidActionList = []

        //Checking validation
		for (let i = 0; i < actionList.length; i++){
            var currAction = actionList[i]

            //Checking gauge requirements
            for (let j = 0; j < gaugeAmounts.length; j++){
                var gaugeName = Object.keys(gaugeAmounts[j])[0]
                if (currAction.hasOwnProperty(gaugeName)){
                    if (gaugeAmounts[j][gaugeName] - currAction[gaugeName] < 0){
                        //NEED TO STORE WHERE IN MOCKACTIONLIST THE ERROR OCCURS
                        invalidActionList.push([currAction, `Not enough ${gaugeName} to cast action.`])
                    }
                    else{
                        gaugeAmounts[j][gaugeName] -= currAction[gaugeName]
                    }
                    break;
                }
            } 

            /*
            var buffList = []

            //Buff requirement check
            if (currAction.hasOwnProperty('buffRequirement')){
                if (!(buffList.contains(currAction.buffRequirement))){
                    invalidActionList.push([currAction, 'The required buff is not active at this time.'])
                }
                else if(buffList.contains(currAction.buffRequirement) && buffList[buffList.indexOf(currAction.buffRequirement)] === 0){
                    invalidActionList.push([currAction, 'You are missing the required stacks of this buff.'])
                }
            }
            */
        }

        return invalidActionList
	}

	addHolySpirit() {
		this.mockActionList.push(getActionInfo(this.job, "Holy Spirit"));
		this.mockActionList = [...this.mockActionList];
	}

	addTimelineAction(e) {
		this.mockActionList.push(getActionInfo(this.job, e.detail.actionName));
		this.mockActionList = [...this.mockActionList];

        console.log("ADD TIMELINE ACTION")

        //Validation check
        let invalidList = this.validation(this.mockActionList, this.job)
        if (invalidList.length === 0){
            let timedList = this.findTimes(this.mockActionList);
            this.calculatePotency(timedList,this.job);
        }
        else{
            console.log(invalidList)
        }
	}

	removeAction(e){
		this.mockActionList.splice(e.detail.indexToRemove, 1);
		this.mockActionList = [...this.mockActionList];
	}

	spliceTimelineAction(e) {
		const movedItem = this.mockActionList.splice(e.detail.currentIndex, 1)[0];
		this.mockActionList.splice(e.detail.destinationIndex, 0, movedItem);
		this.mockActionList = [...this.mockActionList];

        console.log("SPLICE TIMELINE ACTION")

        //Validation check
        let invalidList = this.validation(this.mockActionList, this.job)
        if (invalidList.length === 0){
            let timedList = this.findTimes(this.mockActionList);
            this.calculatePotency(timedList,this.job);
        }
        else{
            console.log(invalidList)
        }
	}
}
