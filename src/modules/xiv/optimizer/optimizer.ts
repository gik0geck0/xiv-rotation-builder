import { LightningElement } from 'lwc';
import { getJobNames } from 'xiv/actionRepository';

export default class Optimizer extends LightningElement {
    //Select job 
    job = 'paladin';
    jobList = getJobNames();

    //Select opt strategy
    optStrategyValue = '';

    get options() {
        return [
            { label: 'Prioritize Simulation Breadth', optStrategyValue: 'breadth' },
            { label: 'Prioritize Simulation Depth', optStrategyValue: 'depth' },
            { label: 'Balanced Simulation', optStrategyValue: 'balanced' }, 
        ];
    }

    //Input slider 
    myValue = 20; //initial value

    handleChange(event) {
        this.myValue = event.detail.value;
    }



    sliderValue: number = 60;  // Initial value of the duration input

    handleSubmit(event: Event): void {
        event.preventDefault();  // Prevent default form submission

        const form = event.target as HTMLFormElement;

        // Gather values from form inputs
        const selectedJob = (form.elements.namedItem('selection') as HTMLSelectElement).value;
        const selectedSetting = (form.elements.namedItem('setting') as HTMLInputElement).value;
        const selectedDuration = (form.elements.namedItem('duration') as HTMLInputElement).value;
        const gcdValue = (form.elements.namedItem('gcd') as HTMLInputElement).value;

        // Validation for job selection
        if (!selectedJob) {
            alert('Please select a job option.');
            return; // Stop the form submission
        }

        // Display the selected values for now (replace this with further functionality)
        alert(`Selected Job: ${selectedJob}\nSelected Setting: ${selectedSetting}\nDuration: ${selectedDuration} seconds\nGCD: ${gcdValue} seconds`);
    }
}
