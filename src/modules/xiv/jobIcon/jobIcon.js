import { LightningElement, api } from "lwc";

export default class JobIcon extends LightningElement {

    @api jobAbv;
    @api actionId;
    @api hoverText;

    constructor(name, url, cd, rc){
        // SHOULD Look up from a skillslist or from the JSON file eventually
        this.name = name;
        this.url = url;
        this.cooldown = cd;
        this.recast = rc;
    }

    // onclick
    // ondelete
    // ondrag?

    get url() {
        return `/assets/icons/xiv/${this.jobAbv}/${this.actionId}.png`;
    }

    get computedSize() {
        return "height:3em;margin:3em;"
    }

    generateIcon(){
        const newImg = document.createElement('img');
        newImg.setAttribute('draggable', 'false');
        newImg.setAttribute('src', this.url);
        const newListItem = document.createElement('li');
        newListItem.setAttribute('draggable', 'true');
        newListItem.setAttribute('class', 'JobIcon');
        newListItem.appendChild(newImg);
        return newListItem;
    }
}