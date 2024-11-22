import fs from 'fs';
import { MCTSOptimizer } from './optimizerUtil';

const NUM_RUNS_PER_SETTING = 10;
const SETTINGS = ['breadth', 'depth', 'balanced'];
const LOG_FILE = 'optimizer_results.json';

const job = 'paladin';
const duration = 10;
const gcd = 2.5;
const iterations = 100000;

const results: Array<{
  setting: string;
  averagePotency: number;
  abilityUsage: { [actionName: string]: number };
  runs: Array<{ run: number; bestPotency: number; bestActions: string[] }>;
}> = [];

SETTINGS.forEach(setting => {
  console.log(`#######################Starting tests for setting: ${setting}#######################`);

  let totalPotency = 0;
  const settingResults: Array<{ run: number; bestPotency: number; bestActions: string[] }> = [];
  const abilityUsage: { [actionName: string]: number } = {};

  for (let i = 1; i <= NUM_RUNS_PER_SETTING; i++) {
    console.log(`[${setting.toUpperCase()} RUN ${i}] Starting MCTS Optimization...`);

    const optimizer = new MCTSOptimizer(job, setting, duration, gcd, iterations);

    // Track ability usage
    optimizer.bestActions.forEach(action => {
      abilityUsage[action.name] = (abilityUsage[action.name] || 0) + 1;
    });

    // Store results for the run
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

  // Sort abilities by usage
  const sortedAbilities = Object.entries(abilityUsage)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([actionName, count]) => ({ actionName, count }));

  console.log(`Finished tests for setting: ${setting}`);
  console.log(`Average Potency for ${setting}: ${averagePotency}`);
  console.log(`Ability Usage (Sorted) for ${setting}:`, sortedAbilities);

  // Store results for this setting
  results.push({
    setting,
    averagePotency,
    abilityUsage: Object.fromEntries(
      Object.entries(abilityUsage).sort(([, countA], [, countB]) => countB - countA)
    ), // Optional: Keep it as an object
    runs: settingResults,
  });
});

// Write results to a file
fs.writeFileSync(LOG_FILE, JSON.stringify(results, null, 2));
console.log(`All tests completed. Results saved to ${LOG_FILE}`);
