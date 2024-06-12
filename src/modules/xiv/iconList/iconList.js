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
        //Allows clicked icons to be added to the selected list, meaning they will be highlighted blue
        if(!this.selectedIcons.includes(currIcon) && currentIcons.includes(currIcon)){
            currIcon.location = "selected";
            this.selectedIcons.push(e.target);
        }
        else if (this.selectedIcons.includes(currIcon) && currentIcons.includes(currIcon)){
            if (this.actionList[currentIcons.indexOf(currIcon)].errorMessage.length > 0){
                currIcon.location = 'invalid'
            }
            else{
                currIcon.location = "list";
            }
            this.selectedIcons.splice(this.selectedIcons.indexOf(currIcon), 1);
        }
    }

    deleteSelected(){ 
        //searches through the list and deletes the selected icons
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
            //dispatches an event to let the HTML know to update the timeline
            this.dispatchEvent(new CustomEvent('removeaction', {detail: {indexToRemove: maxIndex}}));
            this.selectedIcons.splice(index, 1);
        }
        this.cancellSelected();
    }

    clearList(){
        //calls a function in rotation builder to set the list to an empty list
        this.dispatchEvent(new CustomEvent('clearlist'));
    }

    cancellSelected(){
        //cleans up any deleted items that are still selected
        const currentIcons = [...this.template.querySelectorAll("xiv-job-icon")]
        for (let i = 0; i < currentIcons.length; i++){
            if (this.actionList[i].errorMessage.length > 0){
                console.log("error")
                currentIcons[i].location = 'invalid'
            }
            else{
                console.log("no error")
                currentIcons[i].location = 'list'
            }
        }
        this.selectedIcons = [];
    }

    dragStart(e) {
        //function for the start of a dragged event
        this.draggedItem = e.target;
    }

    dragEnd(e) {
        //function for the end of a dragged event
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
        //Finds which item to drop at
        return haystack.findIndex((item) => {
            const box = item.getBoundingClientRect();
            return needle > box.left && needle < box.right;
        });
    }
}