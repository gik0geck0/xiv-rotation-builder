import { LightningElement } from 'lwc';
import { getActionInfo } from 'xiv/actionRepository';
import { getJobNames } from 'xiv/actionRepository';

export default class HelloWorldApp extends LightningElement {
	job = "paladin";
	mockActionList = [].map(getActionInfo.bind(undefined, "paladin"));

	get options() {
        return getJobNames();
    }

	handleChange(){

	}

	addTimelineAction(e) {
		this.mockActionList.push(getActionInfo(this.job, e.detail.actionName));
		this.mockActionList = [...this.mockActionList];
	}

	removeAction(e){
		this.mockActionList.splice(e.detail.indexToRemove, 1);
		this.mockActionList = [...this.mockActionList];
	}

	spliceTimelineAction(e) {
		const movedItem = this.mockActionList.splice(e.detail.currentIndex, 1)[0];
		this.mockActionList.splice(e.detail.destinationIndex, 0, movedItem);
		this.mockActionList = [...this.mockActionList];
	}
}

