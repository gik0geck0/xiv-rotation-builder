import { LightningElement, api } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';
import { getJobNames } from 'xiv/actionRepository';
import { getJobActions } from 'xiv/actionRepository';

import { JobGuide } from "xiv/actionData";

export default class HelloWorldApp extends LightningElement {
	job = "paladin";
	jobActions = getJobActions(this.job);
    totalPotency = 0;
	mockActionList = [].map(getActionInfo.bind(undefined, "paladin"));
	jobList = getJobNames();
    skillDetails = "";

	changeJob(e){
        //Function to change the job, reset the action List and change the tray to the new job
		this.job = this.template.querySelector("select").value;
		this.mockActionList = [].map(getActionInfo.bind(undefined, this.job));
		this.jobActions = getJobActions(this.job);
	}
    
    findTimes(actionList){
        //starts at 0 time
        let currTime = 0;
        //current GCD Time, can be changed if needed
        let GCDTime = 2.5;
        //current wait time
        let waitTime = 0.7;
        //First skill done outside of loop
        //Figure out when the action is done
        if(actionList[0].cast == "Instant"){
            currTime = waitTime;
        }else{
            currTime = parseFloat(actionList[0].cast);
        }
        //Add it to the timed list
        let timedList = [[actionList[0],currTime]];
        //time when you can use the skill again
        let usedActions = [[actionList[0].name, parseFloat(actionList[0].recast)]];
        //save the last GCD to know if a GCD has passed or not
        let lastTime = 0;
        let lastGCD = [actionList[0].name, lastTime];
        //If its an ability, save it with -1 to know it isn't a GCD
        if(actionList[0].type == "Ability"){
            lastGCD[1] = -1;
        }
        for(let i = 1; i < actionList.length; i++){
            let currAction = actionList[i];
            //if on CD, go until CD is up
            for(let j = 0; j < usedActions.length; j++){
                if(currAction.name == usedActions[j][0] && currTime < usedActions[j][1]){
                    currTime = usedActions[j][1];
                }
            }
            //normal time incrementing logic
            if(currAction.type == "Spell" || currAction.type == "Weaponskill"){
                //if instant, just add the wait time
                if(currAction.cast == "Instant"){
                    if(currTime <= lastGCD[1]+GCDTime && lastGCD[1] != -1){
                        currTime = lastGCD[1]+GCDTime+waitTime;
                    }
                    else{
                        currTime += waitTime;
                    }
                    lastTime = currTime - waitTime;
                }
                //if not, add cast time
                else{
                    if(currTime <= lastGCD[1]+GCDTime && lastGCD[1] != -1){
                        currTime = lastGCD[1]+GCDTime + parseFloat(currAction.cast);
                    }
                    else{
                        currTime += parseFloat(currAction.cast);
                    }
                    lastTime = currTime - parseFloat(currAction.cast);
                }
                //push to list and save this action as the last GCD
                let currPair = [currAction,(Math.round(currTime*10)/10)];
                timedList.push(currPair);
                lastGCD = [currAction,(Math.round(lastTime*10)/10)];
            }
            else{
                //if it's a weavable, just add wait time and push it to the list
                currTime += waitTime;
                let currPair = [currAction,(Math.round(currTime*10)/10)];
                timedList.push(currPair);
            }
            //next, we have to add it to the actions used list to see when we can use it again
            //curr time is already the time it was before the skill + the cast time or wait time
            if(currAction.cast != "Instant"){
                //so if the cast time is greater than recast, it means that it will available
                //by the time cast is up
                if(parseFloat(currAction.recast) >= parseFloat(currAction.cast)){
                    usedActions.push([currAction.name, currTime]);
                }
                //otherwise, it will just the the time before the skill plus recast
                else{
                    usedActions.push([currAction.name, (lastTime+ parseFloat(currAction.recast))]);
                }
            }
            //and if it is instant cast, it will just be the time before the cast plus the recast
            else{
                usedActions.push([currAction.name, (lastTime+ parseFloat(currAction.recast))]);
            }

        }
        return timedList;
        
    }

    getBuffs(timedList){
        let currBuffs = [];
        let lastAction = null;
        //Go through the timed list
        for(let i = 0; i < timedList.length; i++ ){
            let currAction = timedList[i][0];
            let currTime = timedList[i][1];
            if(currAction.hasOwnProperty("damageBuff")){
                currBuffs.push([currAction,currTime,currTime+parseFloat(currAction.duration)])
            }
            //check if it grants anything
            if(currAction.hasOwnProperty("grants")){
                for(let k = 0; k <Object.keys(currAction.grants).length; k++){
                    if(parseInt((currAction.grants[Object.keys(currAction.grants)[k]])) != -1){
                        currBuffs.push([Object.keys(currAction.grants)[k].toLowerCase(), parseFloat((currAction.grants[Object.keys(currAction.grants)[k]])), currTime, currTime+30])
                    }
                    else{
                        currBuffs.push([Object.keys(currAction.grants)[k].toLowerCase(), currTime, currTime+parseFloat(currAction.duration)])
                    }
                }
            }
            //Check same thing, but if it is a combo bonus
            if(lastAction != null){
                if(currAction.hasOwnProperty("comboBonus") && currAction.comboAction == lastAction.name){
                    for(let k = 0; k <Object.keys(currAction.comboBonus).length; k++){
                        if(parseInt((currAction.comboBonus[Object.keys(currAction.comboBonus)[k]])) != -1){
                            currBuffs.push([Object.keys(currAction.comboBonus)[k].toLowerCase(), parseFloat((currAction.comboBonus[Object.keys(currAction.comboBonus)[k]])), currTime, currTime+30])
                        }
                        else{
                            currBuffs.push([Object.keys(currAction.comboBonus)[k].toLowerCase(), currTime, currTime+parseFloat(currAction.duration)])
                        }
                    }
                }
            }
            //Save the last action for combo based buffs
            if(currAction.type == "Spell" || currAction.type == "Weaponskill"){
                lastAction = currAction;
            }
        }
        return currBuffs;
    }

    calculatePotency(timedList){

        /*
        Things that still need to be implemented:
        Damage over Time
        Cast times being instant after certain skills
        */
        let currTime = 0;
        //Calculation
        let totalPotency = 0;
        //get all buffs
        let currBuffs = this.getBuffs(timedList);
        let buffAmt = 1;
        let lastAction = {};
        let extraPotency = null;
        let stacksUsed = 0;
        //Go through every item in the list
        for (let i = 0; i < timedList.length; i++ ){
            buffAmt = 1;
            let currAction = timedList[i][0];
            currTime = timedList[i][1];
            //goes through the list of buffs to see if any are active
            for(let j = 0; j<currBuffs.length; j++ ){
                //3 length means a start and end time
                if(currBuffs[j].length == 3){
                    if(currTime <= currBuffs[j][2] && currTime >= currBuffs[j][1]){
                        if(currBuffs[j][0].hasOwnProperty("damageBuff")){
                            buffAmt = parseFloat(currBuffs[j][0].damageBuff);
                        }
                        else if(currAction.hasOwnProperty(currBuffs[j][0])){
                            extraPotency = currBuffs[j][0];
                        }
                        
                    }
                }
                //4 length means a stack based buff
                else{
                    currBuffs[j][1] += stacksUsed;
                    if(currBuffs[j][1] >= 1){
                        if(currAction.hasOwnProperty([currBuffs[j][0]])){
                            extraPotency = currBuffs[j][0];
                        }
                    }
                    stacksUsed = 0;
                }
            }
            
            //loop for GCD Actions
            if(currAction.type == "Spell" || currAction.type == "Weaponskill"){
                //if there is a special potency
                if(extraPotency != null){
                    totalPotency += (parseFloat(currAction[extraPotency])) * buffAmt;
                    stacksUsed = -1;
                }
                //if there is a combo potency
                else if(currAction.comboAction == lastAction.name && currAction.hasOwnProperty("comboAction")){
                    totalPotency += (parseFloat(currAction.comboPotency)) * buffAmt;
                }
                //normal potency
                else if(currAction.hasOwnProperty("potency")){
                    totalPotency += (parseFloat(currAction.potency)) * buffAmt;
                }
                //save the last action for combo checking
                lastAction = currAction;
            }
            //if non-GCD and it has a potency, add that potency
            if (currAction.type == "Ability"){
                if(currAction.hasOwnProperty("potency")){
                    totalPotency += (parseFloat(currAction.potency)) * buffAmt;
                }
            }
            //reset extra potency
            extraPotency = null;
        }
        let PPS = (Math.round((totalPotency/currTime)*100)/100)
        this.template.querySelector('lightning-card.potencyLabel').title="Total Potency: " + totalPotency;
        this.template.querySelector('lightning-card.ppsLabel').title="Potency Per Second: " + PPS;

    }

	validation(actionList, job){
        for (let i = 0; i < actionList.length; i++){
            actionList[i].location = 'list'
            actionList[i].errorMessage = ''
        }

        if (actionList.length === 0){
            this.template.querySelector('lightning-card.potencyLabel').title="Total Potency: Add actions to recieve a potency.";
            this.template.querySelector('lightning-card.ppsLabel').title="Potency Per Second: Add actions to recieve a pps.";
        }
        else{
            let timedList = this.findTimes(actionList);
            //Adding logic to set timeTaken and startTime
            for (let i = 0; i<timedList.length; i++){
                let castTime = 0.7;
                if(timedList[i][0].cast != "Instant"){
                    castTime = parseFloat(timedList[i][0].cast);
                }
                if ( i == 0 ){
                    //change in future for actions before the fight
                    actionList[0].startTime = timedList[i][1] - castTime;
                    actionList[i].timeTaken = castTime;
                }
                else{
                    actionList[i].startTime = timedList[i][1] - castTime;
                    actionList[i-1].timeTaken = actionList[i].startTime - actionList[i-1].startTime;
                }
                if (i == timedList.length-1){
                    actionList[i].timeTaken = castTime;
                }
            }

            //Adding initial gauge amounts to a list so they can be tracked
            var gaugeAmounts = []
            for (let i = 0; i < Object.keys(JobGuide[job].gauges).length; i++){
                var currGauge = Object.keys(JobGuide[job].gauges)[i]
                gaugeAmounts.push({[currGauge] : 0})
            }

            //Checking validation
            var invalidActionList = []
            var buffList = this.getBuffs(timedList)
            for (let i = 0; i < timedList.length; i++){
                var currAction = timedList[i][0]

                //Checking gauge requirements
                for (let j = 0; j < gaugeAmounts.length; j++){
                    //Storing new gauge amounts
                    if (currAction.cast === 'Instant'){
                        gaugeAmounts[Object.keys(gaugeAmounts[j])] = 5 * (Math.floor((timedList[i][1] - 0.7)/2.5))
                    }
                    else{
                        gaugeAmounts[Object.keys(gaugeAmounts[j])] = 5 * (Math.floor((timedList[i][1] - currAction.cast)/2.5))
                    }

                    //Checking against new gauge amounts for enough to cast
                    var gaugeName = Object.keys(gaugeAmounts[j])[0]
                    if (currAction.hasOwnProperty(gaugeName)){
                        if ((gaugeAmounts[Object.keys(gaugeAmounts[j])] + currAction[gaugeName]) < 0){
                            invalidActionList.push([currAction, i, `Not enough ${gaugeName} to cast action.`])
                        }
                        else{
                            gaugeAmounts[j][gaugeName] += currAction[gaugeName]
                        }
                        break;
                    }
                } 

                //Buff requirement check
                if (currAction.hasOwnProperty('buffRequirement')){
                    var buffCheck = 0;
                    //Iterate through the buffList
                    for (let j = 0; j < buffList.length; j++){
                        //If the buff is in the list
                        if (buffList[j][0] === currAction.buffRequirement){
                            buffCheck++;
                            //Check if buff is a stack or time buff
                            if (buffList[j].length === 4){ //Stack buff
                                if (timedList[i][1] < buffList[j][2] || timedList[i][1] > buffList[j][3]){
                                    invalidActionList.push([currAction, i, 'The required buff is not active at this time.'])
                                }
                                else if (buffList[j][1] < 1){
                                    invalidActionList.push([currAction, i, 'You are missing stacks of the required buff.'])
                                }
                                else{
                                    buffList[j][1] -= 1
                                }
                            }
                            else{ //Time buff
                                if (timedList[i][1] < buffList[j][1] || timedList[i][1] > buffList[j][2]){
                                    invalidActionList.push([currAction, i, 'The required buff is not active at this time.'])
                                }
                            }
                        }
                    }
                    if (buffCheck < 1){
                        invalidActionList.push([currAction, i, 'The required buff is not active at this time.'])
                    }
                }
            }

            //Changing the highlights of the actions that are invalid
            if (invalidActionList.length > 0){
                //Make the potency display area tell the user there are invalid actions
                this.template.querySelector('lightning-card.potencyLabel').title="Total Potency: Unable to calculate potency with invalid action(s).";
                this.template.querySelector('lightning-card.ppsLabel').title="Potency Per Second: Unable to calculate pps with invalid action(s).";
                
                //Highlight the actions red if there is an error
                for (let i = 0; i < invalidActionList.length; i++){
                    actionList[invalidActionList[i][1]].location = 'invalid';
                    actionList[invalidActionList[i][1]].errorMessage = invalidActionList[i][2];
                }
            }
            //Run the calculate if valid
            else{
                this.calculatePotency(timedList,this.job);
            }
        }
	}


	addTimelineAction(e) {
        //Adds an action to the timeline and validates
		this.mockActionList.push(JSON.parse(JSON.stringify(getActionInfo(this.job, e.detail.actionName))));
		this.mockActionList = [...this.mockActionList];

        this.validation(this.mockActionList, this.job)
	}

	removeAction(e){
        //removes a list from the timeline and validates
		this.mockActionList.splice(e.detail.indexToRemove, 1);
		this.mockActionList = [...this.mockActionList];

        this.validation(this.mockActionList, this.job)
	}

    clearList(e){
        //Clears out the list
        this.mockActionList = [].map(getActionInfo.bind(undefined, "paladin"));;
        this.validation(this.mockActionList, this.job);
    }

	spliceTimelineAction(e) {
        //splices the action on the timeline
		const movedItem = this.mockActionList.splice(e.detail.currentIndex, 1)[0];
		this.mockActionList.splice(e.detail.destinationIndex, 0, movedItem);
		this.mockActionList = [...this.mockActionList];

        this.validation(this.mockActionList, this.job)
	}

    updateSkillCard(e){
        //Function to update the information about the skill
        let card = this.template.querySelector(".skillCard");
        card.title = e.detail.actionName;
        let text = e.detail.actionDescription;
        //Replacing <br>'s with \n's to add new lines
        text = text.replaceAll(" n " , "\n");
        text = text.replaceAll("<br>" , " ");
        this.skillDetails = text;
    }
}
