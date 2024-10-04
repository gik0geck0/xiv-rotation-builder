// iconList.ts
import { LightningElement, api } from 'lwc';

interface Action {
    id: string;
    name: string;
    type: string;
    startTime: number;
    timeTaken: number;
    errorMessage: string;
    description: string;
    location: string;
}

export default class IconList extends LightningElement {
    @api actionList: Action[] = [];
    @api job!: string;

    selectedIcons: HTMLElement[] = [];
    draggedItem: HTMLElement | null = null;

    get actionTimeline() {
        return this.actionList.map((v, i) => ({ t: i * 2.5, ...v }));
    }

    selectIcon(e: Event) {
        const currentIcons = [...(this.template?.querySelectorAll('xiv-job-icon') || [])];

        const currIcon = e.target as HTMLElement;

        if (!this.selectedIcons.includes(currIcon) && currentIcons.includes(currIcon)) {
            currIcon.setAttribute('location', 'selected');
            this.selectedIcons.push(currIcon);
        } else if (this.selectedIcons.includes(currIcon) && currentIcons.includes(currIcon)) {
            const actionIndex = currentIcons.indexOf(currIcon);
            if (this.actionList[actionIndex].errorMessage.length > 0) {
                currIcon.setAttribute('location', 'invalid');
            } else {
                currIcon.setAttribute('location', 'list');
            }
            this.selectedIcons.splice(this.selectedIcons.indexOf(currIcon), 1);
        }
    }

    deleteSelected() {
        const currentIcons = [...(this.template?.querySelectorAll('xiv-job-icon') || [])];

        let maxIndex = -1;
        let index = -1;
        let length = this.selectedIcons.length;

        for (let i = 0; i < length; i++) {
            maxIndex = -1;
            for (let j = 0; j < length; j++) {
                if (maxIndex < currentIcons.findIndex(e => e === this.selectedIcons[j])) {
                    maxIndex = currentIcons.findIndex(e => e === this.selectedIcons[j]);
                    index = j;
                }
            }
            this.dispatchEvent(
                new CustomEvent('removeaction', { detail: { indexToRemove: maxIndex } })
            );
            this.selectedIcons.splice(index, 1);
        }
        this.cancellSelected();
    }

    clearList() {
        this.dispatchEvent(new CustomEvent('clearlist'));
    }

    cancellSelected() {
        const currentIcons = [...(this.template?.querySelectorAll('xiv-job-icon') || [])];
        for (let i = 0; i < currentIcons.length; i++) {
            if (this.actionList[i].errorMessage.length > 0) {
                currentIcons[i].setAttribute('location', 'invalid');
            } else {
                currentIcons[i].setAttribute('location', 'list');
            }
        }
        this.selectedIcons = [];
    }

    dragStart(e: DragEvent) {
        this.draggedItem = e.target as HTMLElement;
    }

    dragEnd(e: DragEvent) {
        e.preventDefault();
        const listElements = Array.from(this.template?.querySelectorAll('xiv-job-icon') as NodeListOf<HTMLElement>);
        const currentIndex = listElements.findIndex(item => item === this.draggedItem);

        let destinationIndex = this.getClosestItemIndex(listElements, e.clientX);

        if (destinationIndex < 0) {
            const sortableList = this.template?.querySelector('.sortable-list') as HTMLElement;
            if (e.clientX < sortableList.getBoundingClientRect().left) {
                destinationIndex = 0;
            } else {
                destinationIndex = listElements.length;
            }
        }

        this.dispatchEvent(
            new CustomEvent('spliceaction', {
                detail: {
                    currentIndex: currentIndex,
                    destinationIndex: destinationIndex
                }
            })
        );
        this.draggedItem = null;
    }

    dragOver(e: Event) {
        // Placeholder for drag-over handling
    }

    getClosestItemIndex(haystack: HTMLElement[], needle: number): number {
        return haystack.findIndex(item => {
            const box = item.getBoundingClientRect();
            return needle > box.left && needle < box.right;
        });
    }

    displayError(e: Event) {
        const target = e.target as HTMLElement;
        if ((target.getAttribute('errortext') ?? '').length > 1)  {
            this.dispatchEvent(
                new CustomEvent('displayerror', { detail: { error: target.getAttribute('errortext') } })
            );
        }
    }

    removeError() {
        this.dispatchEvent(new CustomEvent('removeerror'));
    }
}
