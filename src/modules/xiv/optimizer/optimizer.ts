// Optimizer.ts
import { LightningElement } from 'lwc';
import { getJobNames } from 'xiv/actionRepository';
import { MCTSOptimizer } from './optimizerUtil';

export default class Optimizer extends LightningElement {
  job = 'paladin';
  jobList = getJobNames();

  optStrategyValue = '';

  get options(): { label: string; optStrategyValue: string }[] {
    return [
      { label: 'Prioritize Simulation Breadth', optStrategyValue: 'breadth' },
      { label: 'Prioritize Simulation Depth', optStrategyValue: 'depth' },
      { label: 'Balanced Simulation', optStrategyValue: 'balanced' }
    ];
  }
  
  myValue = 20;
  sliderValue = 60;

  handleSubmit(event: Event): void {
    event.preventDefault(); // Prevent the default form submission behavior
  
    // Use querySelector to get the values from the form fields
    const selectedJob = this.template?.querySelector('[name="jobSelector"]') as HTMLSelectElement | null;
    const selectedSetting = this.template?.querySelector('lightning-radio-group') as any;
    const selectedDuration = this.template?.querySelector('[name="duration"]') as HTMLInputElement | null;
    const gcdValue = this.template?.querySelector('[name="gcd"]') as HTMLInputElement | null;
  
    // Debugging logs
    // console.log("selectedJob:", selectedJob?.value);
    // console.log("selectedSetting:", selectedSetting?.value); // Updated to use correct value property
    // console.log("selectedDuration:", selectedDuration?.value);
    // console.log("gcdValue:", gcdValue?.value);

    // Validation to ensure elements are found and have values
    if (!selectedJob || !selectedJob.value ||
        !selectedSetting || !selectedSetting.value ||
        !selectedDuration || !selectedDuration.value ||
        !gcdValue || !gcdValue.value) {
      alert('Please ensure all inputs are filled.');
      return;
    }
  
    // Extract values from the elements
    const jobValue = selectedJob.value;
    const strategyValue = selectedSetting.value; // Updated to fetch the value from lightning-radio-group
    const durationValue = Number(selectedDuration.value);
    const gcd = Number(gcdValue.value);
  
    // Display the selected values to verify
    // alert(`Selected Job: ${jobValue}\nSelected Setting: ${strategyValue}\nDuration: ${durationValue} seconds\nGCD: ${gcd} seconds`);
  
    // Call the optimizer with these values
    const optimizer = new MCTSOptimizer(jobValue, strategyValue, durationValue, gcd);
    optimizer.monteCarloTreeSearch(1000);
  }
  
  

  
}