import { LightningElement } from 'lwc';
import { getJobNames } from 'xiv/actionRepository';
import { MCTSOptimizer } from './optimizerUtil';

// Enum for Strategy Type
enum StrategyType {
  Breadth = 'breadth',
  Depth = 'depth',
  Balanced = 'balanced',
}

export default class Optimizer extends LightningElement {
  job = 'paladin';
  jobList = getJobNames();

  // Set the type of optStrategyValue to be StrategyType, initialized to Breadth
  optStrategyValue: StrategyType = StrategyType.Breadth;

  // Options for the radio group
  get options(): { label: string; value: StrategyType }[] {
    return [
      { label: 'Prioritize Simulation Breadth', value: StrategyType.Breadth },
      { label: 'Prioritize Simulation Depth', value: StrategyType.Depth },
      { label: 'Balanced Simulation', value: StrategyType.Balanced },
    ];
  }

  myValue = 20;
  sliderValue = 60;

  // Update optStrategyValue when the radio button is changed
  handleRadioChange(event: Event): void {
    const selectedOption = (event.target as HTMLInputElement).value as StrategyType;
    this.optStrategyValue = selectedOption; // Ensure it matches StrategyType
    console.log('Selected strategy:', this.optStrategyValue); // Debugging line
  }

  // Check and send the value when the form is submitted
  handleSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission behavior

    const selectedJob = this.template?.querySelector('[name="jobSelector"]') as HTMLSelectElement | null;
    const selectedDuration = this.template?.querySelector('[name="duration"]') as HTMLInputElement | null;
    const gcdValue = this.template?.querySelector('[name="gcd"]') as HTMLInputElement | null;

    // Validation to ensure elements are found and have values
    if (!selectedJob || !selectedJob.value ||
        !selectedDuration || !selectedDuration.value ||
        !gcdValue || !gcdValue.value) {
      alert('Please ensure all inputs are filled.');
      return;
    }

    const jobValue = selectedJob.value;
    const strategyValue = this.optStrategyValue; // Strategy should be of type StrategyType
    const durationValue = Number(selectedDuration.value);
    const gcd = Number(gcdValue.value);

    // Check if the strategy value is valid (this will be redundant since we're using the enum)
    if (!Object.values(StrategyType).includes(strategyValue)) {
      alert('Invalid strategy selected.');
      return;
    }

    // Log values for debugging
    console.log('Selected Job:', jobValue);
    console.log('Selected Setting:', strategyValue);  // Log to check value
    console.log('Duration:', durationValue);
    console.log('GCD:', gcd);

    // Call the optimizer with these values
    new MCTSOptimizer(jobValue, strategyValue, durationValue, gcd);
  }
}