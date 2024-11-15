import { MCTSOptimizer } from './optimizerUtil';
import type { Action } from 'xiv/actionData';

let optimizer: MCTSOptimizer;

//factory
function MCTSFactory(jobValue: string, strategyValue: string, durationValue: number, gcdValue: number, iterations: number): MCTSOptimizer {
    if(optimizer == null){
        console.log('worker creating optimizer');
        optimizer = new MCTSOptimizer(jobValue, strategyValue, durationValue, gcdValue, iterations);
    }
    else{
        console.log('worker already created');
    }
    return optimizer;
  }

self.onmessage = function (event) {

    const { job, setting, duration, gcd, iterations } = event.data;

    // Initialize MCTSOptimizer instance
    const optimizer = new MCTSOptimizer(job, setting, duration, gcd, iterations);
    //optimizer = MCTSFactory(job, setting, duration, gcd, iterations);

    // Run the Monte Carlo Tree Search (MCTS) in the worker
    const jobActions = optimizer.bestActions;
    const potency = optimizer.bestPotency;

    console.log(potency);
    console.log(jobActions);

    const result = [jobActions, potency];

    // Post the result back to the main thread
    postMessage({
        bestActions: result[0],
        bestDamage: result[1],
    });
};

export class MCTSOptimizerWithWorker {
    job: string;
    setting: string;
    duration: number;
    gcd: number;
    bestActions: Action[];
    bestPotency: number;

    constructor(job: string, setting: string, duration: number, gcd: number, iterations: number) {
        this.job = job;
        this.setting = setting;
        this.duration = duration;
        this.gcd = gcd;
        this.bestActions = [];
        this.bestPotency = -Infinity;

        // Initialize the Web Worker
        console.log('creating worker');

        const worker = new Worker(new URL('./optWorker.ts', import.meta.url));

        
        // Send the data to the worker
        worker.postMessage({
            job: this.job,
            setting: this.setting,
            duration: this.duration,
            gcd: this.gcd,
            iterations: iterations
        });

        // Listen for the worker's response
        worker.onmessage = (event) => {
            console.log('Message received from worker');
            const { bestActions, bestDamage } = event.data;
            this.bestActions = bestActions;
            this.bestPotency = bestDamage;
            console.log(`[LOG] Best actions found: ${bestActions.map(a => a.name).join(" * ")}`);
            console.log(`[LOG] Best damage: ${bestDamage}`);
        };

        worker.onerror = (error) => {
            console.error(`[Worker Error] ${error.message}`);
        };
    }
}
