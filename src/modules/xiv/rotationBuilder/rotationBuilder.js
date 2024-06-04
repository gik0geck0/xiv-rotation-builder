import { LightningElement } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';

import { JobGuide } from "xiv/actionData";

console.log(JobGuide)

export default class HelloWorldApp extends LightningElement {
	mockActionList = [].map(getActionInfo.bind(undefined, "paladin"));
    job = "paladin";

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

