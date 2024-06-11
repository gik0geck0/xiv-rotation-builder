import { LightningElement, api } from "lwc";



export default class IconList extends LightningElement {
    // TBD: should this just be action names so it's easy to shuffle? Or stay fully resolve to reduce constant lookups?
    @api actionList;
    @api job;
    @api invalidActionList;

    get actionTimeline() {
        // Make up a time component to use as a unique value
        return this.actionList.map((v, i) => Object.assign({t: i*2.5}, v));
    }

    selectedIcons = [];
    draggedItem;

    selectIcon(e){
        let currentIcons = [...this.template.querySelectorAll("xiv-job-icon")];
        let currIcon = e.target;
        if(!this.selectedIcons.includes(currIcon) && currentIcons.includes(currIcon)){
            //currIcon.style.setProperty('background', 'red');
            currIcon.location = "selected";
            this.selectedIcons.push(e.target);
        }
        else if (this.selectedIcons.includes(currIcon) && currentIcons.includes(currIcon)){
            currIcon.location = "list";
            this.selectedIcons.splice(this.selectedIcons.indexOf(currIcon), 1);
        }
    }

    deleteSelected(){ 
        const currentIcons = [...this.template.querySelectorAll("xiv-job-icon")]
        let maxIndex = -1; 
        let index = -1;
        let length = this.selectedIcons.length;
        for(let i = 0; i<length; i++){
            maxIndex = -1;
            for(let j = 0; j<length; j++){
                if (maxIndex < currentIcons.findIndex((e) => e === this.selectedIcons[j])){
                    maxIndex = currentIcons.findIndex((e) => e === this.selectedIcons[j]);
                    index = j;
                }
            }
            this.dispatchEvent(new CustomEvent('removeaction', {detail: {indexToRemove: maxIndex}}));
            this.selectedIcons.splice(index, 1);
        }
        this.cancellSelected();
    }

    clearList(){
        this.dispatchEvent(new CustomEvent('clearlist'));
    }

    cancellSelected(){
        const currentIcons = [...this.template.querySelectorAll("xiv-job-icon")]
        for(let icon of currentIcons){
            if (!(icon.location === 'invalid')){
                icon.location = "list";
            }
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