import { LightningElement } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';

import { JobGuide } from "xiv/actionData";

console.log(JobGuide)

export default class HelloWorldApp extends LightningElement {
	mockActionList = ["Holy Spirit", "Holy Spirit", "Holy Spirit", "Fast Blade"].map(getActionInfo.bind(undefined, "paladin"));
    job = "paladin";

	addHolySpirit() {
		this.mockActionList.push(getActionInfo(this.job, "Holy Spirit"));
		this.mockActionList = [...this.mockActionList];
	}

	addTimelineAction(e) {
		this.mockActionList.push(getActionInfo(this.job, e.detail.actionName));
		this.mockActionList = [...this.mockActionList];
	}
}

