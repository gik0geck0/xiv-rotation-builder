import { LightningElement, api } from "lwc";

export default class IconList extends LightningElement {
    // TBD: should this just be action names so it's easy to shuffle? Or stay fully resolve to reduce constant lookups?
    @api actionList;
    @api job;

    get actionTimeline() {
        // Make up a time component to use as a unique value
        return this.actionList.map((v, i) => Object.assign({t: i*2.5}, v));
    }

    draggedItem;
    tempActionList;

    dragStart(e) {
        this.draggedItem = e.target;
    }

    dragEnd(e) {
        e.preventDefault();
        let tempActionList = [...this.actionList];
        const listElements = [...this.template.querySelectorAll("xiv-job-icon"),];
        const currentIndex = listElements.findIndex((e) => e === this.draggedItem);
        let destinationIndex = this.getClosestItemIndex(listElements, e.clientX);

        if (destinationIndex < 0) {
            if (e.clientX < this.template.querySelector(".sortable-list").getBoundingClientRect().left) {
                destinationIndex = 0;
            } else {
                destinationIndex = listElements.length;
            }
        } 
        const movedItem = tempActionList.splice(currentIndex, 1)[0];
        //@api can't be modified by the component through modifiying functions like splice
        tempActionList.splice(destinationIndex, 0, movedItem);
        console.log(tempActionList);
        this.actionList = tempActionList;
        this.draggedItem = null;
    }

    dragOver(e) {
        // show cursor for drop location?
    }

    getClosestItemIndex(haystack, needle) {
        return haystack.findIndex((item) => {
            const box = item.getBoundingClientRect();
            return needle > box.left && needle < box.right;
        });
    }

}