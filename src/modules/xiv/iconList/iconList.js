import { LightningElement, api } from "lwc";

export default class IconList extends LightningElement {
    // TBD: should this just be action names so it's easy to shuffle? Or stay fully resolve to reduce constant lookups?
    @api actionList;
    @api job;

    get actionTimeline() {
        // Make up a time component to use as a unique value
        return this.actionList.map((v, i) => Object.assign({t: i*2.5}, v));
    }

    selectedIcons = [];
    draggedItem;

    selectIcon(e){
        let currentIcons = [...this.template.querySelectorAll("xiv-job-icon")];
        if(!this.selectedIcons.includes(e.target) && currentIcons.includes(e.target)){
            e.target.style.setProperty('background', 'red');
            this.selectedIcons.push(e.target);
            console.log(this.selectedIcons);
        }
    }

    deleteSelected(){ 
        const currentIcons = [...this.template.querySelectorAll("xiv-job-icon")]
        for(let icon of this.selectedIcons){
            let index = currentIcons.findIndex((e) => e === icon);
            this.dispatchEvent(new CustomEvent('removeaction', {detail: {indexToRemove: index}}));
        }
        this.cancellSelected();
    }

    cancellSelected(){
        console.log(this.selectedIcons);
        for(let icon of this.selectedIcons){
            console.log(icon);
            icon.style.background = "none";
        }
        this.selectedIcons = [];
    }

    dragStart(e) {
        this.draggedItem = e.target;
    }

    dragEnd(e) {
        e.preventDefault();
        const listElements = [...this.template.querySelectorAll("xiv-job-icon")];
        const currentIndex = listElements.findIndex((e) => e === this.draggedItem);
        let destinationIndex = this.getClosestItemIndex(listElements, e.clientX);

        if (destinationIndex < 0) {
            if (e.clientX < this.template.querySelector(".sortable-list").getBoundingClientRect().left) {
                destinationIndex = 0;
            } else {
                destinationIndex = listElements.length;
            }
        } 
        this.dispatchEvent(new CustomEvent('spliceaction', {detail: {currentIndex: currentIndex, destinationIndex: destinationIndex}}));
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