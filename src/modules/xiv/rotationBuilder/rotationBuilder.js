import { LightningElement } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';

import { JobGuide } from "xiv/actionData";

console.log(JobGuide)

export default class HelloWorldApp extends LightningElement {
    mockActionList = ["Holy Spirit", "Holy Spirit", "Holy Spirit"].map(getActionInfo.bind(undefined, "pld"));
    job = "pld";

	addHolySpirit() {
		this.mockActionList.push(getActionInfo(this.job, "Holy Spirit"));
	}
}

