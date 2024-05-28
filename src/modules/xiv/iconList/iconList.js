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

    dragStart(e) {
        this.draggedItem = e.target;
    }

    dragEnd(e) {
        e.preventDefault();
        const listElements = [...this.template.querySelectorAll("li:not(.dragging)"),];
        const currentIndex = listElements.findIndex((e) => e === this.draggedItem);
        const destinationIndex = this.getClosestItemIndex(listElements, e.clientX);

        if (destinationIndex < 0) {
            if (e.clientX < this.draggedItem.getBoundingClientRect().left) {
                destinationIndex = 0;
            } else {
                destinationIndex = listElements.length;
            }
        } 

        const movedItem = this.actionList.splice(currentIndex, 1)[0];
        // TODO: the size of the list has changed, check a<b or a>b to adjust destinationIndex accordingly
        this.actionList.splice(destinationIndex, 0, movedItem);
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