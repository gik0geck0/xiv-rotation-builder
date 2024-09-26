import { LightningElement } from 'lwc';

export default class Optimizer extends LightningElement {
    
    // Store the initial slider value
    sliderValue = 60;

    renderedCallback(): void {
        // Ensure the slider value is set when the component is rendered
        const durationDisplay = this.template.querySelector('#durationValue') as HTMLElement;

        // Update the span with the slider's initial value
        if (durationDisplay) {
            durationDisplay.textContent = this.sliderValue.toString();
        }
    }

    // Function to handle form submission
    handleSubmit(event: Event): void {
        event.preventDefault(); // Prevent the default form submission behavior

        const form = event.target as HTMLFormElement;

        // Get the selected dropdown option
        const selectedOption = (form.elements.namedItem('selection') as HTMLSelectElement).value;

        // Get the selected radio button value
        const selectedSetting = (form.elements.namedItem('setting') as HTMLInputElement).value;

        // Get the slider value for duration
        const selectedDuration = (form.elements.namedItem('duration') as HTMLInputElement).value;

        // Display the alert with selected values
        alert(`Selected Option: ${selectedOption}\nSelected Setting: ${selectedSetting}\nDuration: ${selectedDuration} seconds`);
    }

    // Function to update the displayed slider value
    handleSliderChange(event: Event): void {
        // Convert the slider value from string to number
        this.sliderValue = Number((event.target as HTMLInputElement).value);

        // Update the displayed value in the DOM
        const durationDisplay = this.template.querySelector('#durationValue') as HTMLElement;
        if (durationDisplay) {
            durationDisplay.textContent = this.sliderValue.toString();
        }
    }
}
