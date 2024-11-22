import fs from 'fs';
import { MCTSOptimizer } from './optimizerUtil';

import { JSDOM } from 'jsdom';

const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
global.Element = dom.window.Element;
global.HTMLElement = dom.window.HTMLElement;



const NUM_RUNS_PER_SETTING = 100;
const SETTINGS = ['breadth', 'depth', 'balanced'];
const LOG_FILE = 'optimizer_results.json'; 

// Parameters for the optimizer testing
const job = 'paladin';
const duration = 10; 
const gcd = 2.5; 
const iterations = 100000; 

const results: Array<{
  setting: string;
  averagePotency: number;
  runs: Array<{ run: number; bestPotency: number; bestActions: string[] }>;
}> = [];

SETTINGS.forEach(setting => {
  console.log(`Starting tests for setting: ${setting}`);
  
  let totalPotency = 0;
  const settingResults: Array<{ run: number; bestPotency: number; bestActions: string[] }> = [];

  for (let i = 1; i <= NUM_RUNS_PER_SETTING; i++) {
    console.log(`[${setting.toUpperCase()} RUN ${i}] Starting MCTS Optimization...`);

    const optimizer = new MCTSOptimizer(job, setting, duration, gcd, iterations);

    // store results
    const runResult = {
      run: i,
      bestPotency: optimizer.bestPotency,
      bestActions: optimizer.bestActions.map(action => action.name),
    };

    settingResults.push(runResult);
    totalPotency += optimizer.bestPotency;

    console.log(`[${setting.toUpperCase()} RUN ${i}] Completed. Best Potency: ${optimizer.bestPotency}`);
  }

  const averagePotency = totalPotency / NUM_RUNS_PER_SETTING;

  console.log(`Finished tests for setting: ${setting}`);
  console.log(`Average Potency for ${setting}: ${averagePotency}`);

  // store results
  results.push({
    setting,
    averagePotency,
    runs: settingResults,
  });
});

// write results
fs.writeFileSync(LOG_FILE, JSON.stringify(results, null, 2));
console.log(`All tests completed. Results saved to ${LOG_FILE}`);
