import { LightningElement } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';

export default class HelloWorldApp extends LightningElement {
    mockActionList = ["Holy Spirit", "Holy Spirit", "Holy Spirit", "Fast Blade"].map(getActionInfo.bind(undefined, "paladin"));
    job = "paladin";

	addHolySpirit() {
		this.mockActionList.push(getActionInfo(this.job, "Holy Spirit"));
	}
}

