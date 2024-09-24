// optimizer.ts
import { LightningElement } from 'lwc';

export default class Optimizer extends LightningElement {


    // Function to handle form submission
    handleSubmit(event: Event): void {
        event.preventDefault(); // Prevent the default form submission behavior

        const form = event.target as HTMLFormElement;

        // Get the selected dropdown option
        const selectedOption = (form.elements.namedItem('selection') as HTMLSelectElement).value;

        // Get the selected radio button value
        const selectedSetting = (form.elements.namedItem('setting') as HTMLInputElement).value;

        // Display the alert with selected values
        alert(`Selected Option: ${selectedOption}\nSelected Setting: ${selectedSetting}`);
    }
}
