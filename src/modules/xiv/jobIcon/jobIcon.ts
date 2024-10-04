// jobIcon.ts
import { api, LightningElement } from 'lwc';

export default class JobIcon extends LightningElement {
    @api starttime: number = 0;
    @api timetaken: number = 0.7;
    @api name!: string;
    @api location: string = 'tray';
    @api jobAbv!: string;
    @api type: string = '';
    @api actionId!: string;
    @api hoverText!: string;

    gcdLength = 2.5;
    tenthOfASecondToPixelRatio = 100;

    get url(): string {
        return `/assets/icons/xiv/${this.jobAbv}/${this.actionId}.png`;
    }

    get imgComputedSize(): string {
        if (this.location === 'tray') {
            return 'height:35px; width:35px; margin:5px; padding:0px;';
        } else if (this.type === 'Ability') {
            return 'height:50px; width:50px; margin:0px; padding:5px; vertical-align: top;';
        } else {
            return 'height:70px; width:70px; margin:0px; padding:5px;';
        }
    }

    get liComputedSize(): string {
        const width = this.timetaken * this.tenthOfASecondToPixelRatio;
        if (this.location === 'tray') {
            return 'cursor: grab; display: inline; height: 35px; width: 35px; margin: 10px; padding: 10px;';
        } else if (this.location === 'selected') {
            if (this.type === 'Ability') {
                return `cursor: grab; display: inline-flex; height:50px; width:${width}px; margin:0px; padding:0px; background: skyblue; vertical-align: top; margin-top: 10px;`;
            } else {
                return `cursor: grab; display: inline-flex; height:70px; width:${width}px; margin:0px; padding:0px; background: skyblue; margin-top: 30px; position:relative;`;
            }
        } else if (this.location === 'invalid') {
            if (this.type === 'Ability') {
                return `cursor: grab; display: inline-flex; height:50px; width:${width}px; margin:0px; padding:0px; background: red; vertical-align: top; margin-top: 10px;`;
            } else {
                return `cursor: grab; display: inline-flex; height:70px; width:${width}px; margin:0px; padding:0px; background: red; margin-top: 30px; position:relative;`;
            }
        } else {
            if (this.type === 'Ability') {
                return `cursor: grab; display: inline-flex; height:50px; width:${width}px; margin:0px; padding:0px; vertical-align: top; margin-top: 10px;`;
            } else {
                return `cursor: grab; display: inline-flex; height:70px; width:${width}px; margin:0px; padding:0px; margin-top: 30px; position:relative;`;
            }
        }
    }

    get gcdComputedSize(): string {
        if (this.location === 'list' && this.type !== 'Ability') {
            return `width: ${(this.gcdLength - 0.7) * this.tenthOfASecondToPixelRatio}px; height: 20px; background: green; visibility: visible; z-index: 1; position:absolute; left:${0.7 * this.tenthOfASecondToPixelRatio}px; bottom: 5px;`;
        }
        return 'visibility: hidden;';
    }
}
