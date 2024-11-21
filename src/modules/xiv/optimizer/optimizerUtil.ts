import type { Action } from 'xiv/actionData';
import { getJobActions } from 'xiv/actionRepository';
import { findTimes, calculatePotency, validateActions } from 'xiv/rotationBuilder';

type TreeNode = {
  action: Action | null;
  parent: TreeNode | null;
  children: TreeNode[];
  visits: number;
  score: number;
  actionSequence: Action[];
};

type LogLevel = 0 | 1;
const LOG_LEVEL: LogLevel = 0;

// The MCTS optimizer class
export class MCTSOptimizer {
  actions: Action[];
  bestDamage: number; 
  bestActionSequence: Action[];
  root: TreeNode;

  job: string;
  setting: string;
  duration: number;
  gcd: number;
  bestActions: Action[];
  bestPotency: number;
  iterations: number;
  bestTime: number;

 // MCTS core functions

 // Function to calculate the score based on action potency
 score(actions: Action[]): number {
    if (LOG_LEVEL === 1) {
        console.log("[LOG] Calculating score for actions: ", actions.map(a => a.name));
    }
    // Calculate the score based on potency (or any other metric you are using)
    const result = validateActions(actions, this.job, this.gcd, false);

    const damage = result[0];
    const time = result[1];

    // Check if the current damage is better than the best known damage
    if (damage > this.bestDamage) {
        this.bestDamage = damage; // Update the best damage
        this.bestActionSequence = [...actions]; // Update the best action sequence
        this.bestTime = time; 
        if (LOG_LEVEL === 1) {
            console.log("[LOG] New best sequence found:", this.bestActionSequence.map(a => a.name).join(" * "));
            console.log("[LOG] New best damage:", this.bestDamage);
        }
    }
  
    return damage;
  }

// Selects the best child node based on visits and score
select(node: TreeNode): TreeNode {
    if (LOG_LEVEL === 1) {
        console.log("[LOG] Selecting node. Current children: ", node.children.map(c => c.action?.name));
    }
    if (node.children.length === 0) {
        return node; // No selection possible
    }

    // Filter out children that have not been visited
    const unvisitedChildren = node.children.filter(child => child.visits === 0);
    
    let selectedNode;
    if (unvisitedChildren.length > 0) {
        // If there are unvisited nodes, pick one randomly
        selectedNode = unvisitedChildren[Math.floor(Math.random() * unvisitedChildren.length)];
    } else {
        // Otherwise, pick the one with the highest score
        selectedNode = node.children.reduce((bestChild, currentChild) => 
        bestChild.score > currentChild.score ? bestChild : currentChild
        );
    }

    if (LOG_LEVEL === 1) {
        console.log("[LOG] Selected node: ", selectedNode.action?.name);
    }
    return selectedNode;
}


  // Expands the current node with all possible child actions
  expand(node: TreeNode): void {
    if (LOG_LEVEL === 1) {
        console.log("[LOG] Expanding node: ", node.action?.name);
    }
  
    this.actions.forEach(action => {
        const newNode: TreeNode = {
            action: action,
            parent: node, // Set parent to the current node
            children: [],
            visits: 0,
            score: 0,
            actionSequence: [...node.actionSequence, action] // Create a sequence of actions
        };
        node.children.push(newNode);
    });
  
    if (LOG_LEVEL === 1) {
        console.log("[LOG] Expanded with new children: ", node.children.map(c => c.action?.name));
    }
  }

  // Simulates the outcomes based on the action sequence at the current node
  simulate(node: TreeNode): number {
    if (LOG_LEVEL === 1) {
        console.log("[LOG] Simulating from node: ", node.action?.name);
    }
  
    const randomActions: Action[] = [...node.actionSequence]; // Start with the sequence from this node
    let result = validateActions(randomActions, this.job, this.gcd, false);
    let valid = result[0];
    let time = result[1]; 

    // If we are starting with something invalid return -1
    if(valid === -1){
        if(LOG_LEVEL === 1){
            console.log("[LOG] Invalid action in list: ", randomActions.map(a => a.name).join(" * "));
        }
        return -1;
    }


    // Else we add random valid actions to list until duration is met
    while (time < this.duration) {
        let randomAction = this.weightedRandomAction(randomActions[randomActions.length -1]);
        randomActions.push(randomAction);

        result = validateActions(randomActions, this.job, this.gcd, false);
        valid = result[0];
        time =  result[1]; // Progressively increases as randomActions list gets more actions

        if(valid === -1){
            if(LOG_LEVEL === 1){
                console.log("[LOG] Invalid action list: ", randomActions.map(a => a.name).join(" * "));
            }
            const invalidChild = node.children.find(child => child.action === randomAction);

            if (invalidChild) {
                if(LOG_LEVEL === 1){
                    console.log("[LOG] Marrking invalid action: ", randomAction?.name + " " + invalidChild?.visits);
                }
                invalidChild.visits++;
            }            

            randomActions.pop();
            continue;
        }

        if (LOG_LEVEL === 1) {
            console.log("[LOG] Added action during simulation: ", randomAction.name);
            console.log("[LOG] Current Time: ", time)
        }
    }

    randomActions.pop(); // Pop the last action of the list going over duration
  
    if (LOG_LEVEL === 1) {
        console.log("[LOG] Simulated actions (in order): ", randomActions.map(a => a.name));
    }
    const calculatedScore = this.score(randomActions); // This now updates the best sequence
    if (LOG_LEVEL === 1) {
        console.log("[LOG] Simulated score: ", calculatedScore);
    }
    return calculatedScore;
  }

//   // Returns a randomly selected action based on weighted potency
//     weightedRandomAction(): Action {
//         const totalScore = this.actions.reduce((sum, action) => sum + (action.potencyNumeric || 0), 0);
//         const randomValue = Math.random() * totalScore;

//         let cumulative = 0;
//         for (const action of this.actions) {
//             cumulative += (action.potencyNumeric || 0); // Use potency as weight
//             if (cumulative >= randomValue) {
//                 return action;
//             }
//         }

//         return this.actions[0]; // Fallback
//   }

// Returns a randomly selected action based on the setting and weighted potency
// weightedRandomAction(): Action {
//     let weightedActions: { action: Action, weight: number }[];
//     const baseWeight = 100;

//     if (this.setting === "breadth") {
//         // Weights are more uniform, but include potency to a lesser degree
//         weightedActions = this.actions.map(action => ({
//             action,
//             weight: baseWeight + (action.potencyNumeric || 0) * .2
//         }));
//     } else if (this.setting === "depth") {
//         // Weights are proportional to potency to prioritize depth
//         weightedActions = this.actions.map(action => ({
//             action,
//             weight: (action.potencyNumeric || 0) * 2
//         }));
//     } else if (this.setting === "balanced") {
//         // Accounts for potencies but also maintains some uniformity
//         weightedActions = this.actions.map(action => ({
//             action,
//             weight: baseWeight + (action.potencyNumeric || 0) * .5
//         }));
//     } else {
//         // Default to using potency as weight
//         weightedActions = this.actions.map(action => ({
//             action,
//             weight: (action.potencyNumeric || 0)
//         }));
//     }

//     // Calculate cumulative weights for random selection
//     const totalWeightedScore = weightedActions.reduce((sum, entry) => sum + entry.weight, 0);
//     const randomValue = Math.random() * totalWeightedScore;

//     let cumulative = 0;
//     for (const entry of weightedActions) {
//         cumulative += entry.weight;
//         if (cumulative >= randomValue) // and calculatePotency doesn't throw an error for that action
//         {
//             return entry.action;
//         }
//     }

//     // Fallback in case of rounding issues
//     return this.actions[0];
// }

// Returns a randomly selected action based on the setting and weighted potency
weightedRandomAction(lastAction: Action): Action {
    let weightedActions: { action: Action, weight: number }[];
    const baseWeight = 100;

    if (this.setting === "breadth") {
        // Weights are more uniform, but include potency to a lesser degree
        weightedActions = this.actions.map(action => {
            const isCombo = action?.comboAction === lastAction.name;
        
            if (isCombo && LOG_LEVEL === 1) {
                console.log(`[LOG] Combo action found: ${action.name} (combo with ${lastAction.name})`);
            }
        
            return {
                action,
                weight: baseWeight + (
                    isCombo
                        ? (action.comboPotencyNumeric || 0) * 0.02
                        : (action.potencyNumeric || 0) * 0.02
                )
            };
        });
        
    } else if (this.setting === "depth") {
        // Weights are proportional to potency to prioritize depth
        // This takes much longer but yeilds better results
        weightedActions = this.actions.map(action => {
            const isCombo = action?.comboAction === lastAction.name;
        
            if (isCombo && LOG_LEVEL === 1) {
                console.log(`[LOG] Combo action found: ${action.name} (combo with ${lastAction.name})`);
            }
        
            return {
                action,
                weight: baseWeight + (
                    isCombo
                        ? (action.comboPotencyNumeric || 0)
                        : (action.potencyNumeric || 0)
                )
            };
        });

        weightedActions.sort(() => Math.random() - 0.5); //shuffle them for randomness when selecting

        // Initialize a frequency map
        const frequencyMap = new Map<Action, number>();

        // Run the selection process multiple times
        for (let i = 0; i < 100; i++) {
            // Shuffle the actions for randomness
            const totalWeightedScore = weightedActions.reduce((sum, entry) => sum + entry.weight, 0);
            const randomValue = Math.random() * totalWeightedScore;

            let cumulative = 0;
            for (const entry of weightedActions) {
                cumulative += entry.weight;
                if (cumulative >= randomValue) {
                    // Count the selection in the frequency map
                    frequencyMap.set(entry.action, (frequencyMap.get(entry.action) || 0) + 1);
                    break;
                }
            }
        }

        //Determine the action with the highest frequency
        let mostFrequentAction;
        let maxFrequency = -1;
        for (const [action, frequency] of frequencyMap) {
            if (frequency > maxFrequency) {
                mostFrequentAction = action;
                maxFrequency = frequency;
            }
        }

        //Return the most frequently selected action
        return mostFrequentAction;

    } else if (this.setting === "balanced") {
        // Accounts for potencies but also maintains some uniformity
        weightedActions = this.actions.map(action => {
            const isCombo = action?.comboAction === lastAction.name;
        
            if (isCombo && LOG_LEVEL === 1) {
                console.log(`[LOG] Combo action found: ${action.name} (combo with ${lastAction.name})`);
            }
        
            return {
                action,
                weight: baseWeight + (
                    isCombo
                        ? (action.comboPotencyNumeric || 0) * Math.random()
                        : (action.potencyNumeric || 0) * Math.random()
                )
            };
        });
    } else {
        // Default to using potency as weight
        weightedActions = this.actions.map(action => {
            const isCombo = action?.comboAction === lastAction.name;
        
            if (isCombo && LOG_LEVEL === 1) {
                console.log(`[LOG] Combo action found: ${action.name} (combo with ${lastAction.name})`);
            }
        
            return {
                action,
                weight: baseWeight + (
                    isCombo
                        ? (action.comboPotencyNumeric || 0)
                        : (action.potencyNumeric || 0)
                )
            };
        });
    }

    // Calculate cumulative weights for random selection
    weightedActions.sort(() => Math.random() - 0.5); //shuffle them for randomness when selecting
    const totalWeightedScore = weightedActions.reduce((sum, entry) => sum + entry.weight, 0);
    const randomValue = Math.random() * totalWeightedScore;

    let cumulative = 0;
    for (const entry of weightedActions) {
        cumulative += entry.weight;
        if (cumulative >= randomValue) // and calculatePotency doesn't throw an error for that action
        {
            if(LOG_LEVEL === 1){
                if(entry.action?.comboAction === lastAction.name){
                    console.log(`[LOG] Using combo action: ${entry.action.name} (combo with ${lastAction.name})`);
                }
            }
            }
            return entry.action;
        }
   
    // Fallback in case of rounding issues
    return this.actions[0];
}


  // Backpropagates the result of the simulation up the tree
  backpropagate(node: TreeNode, result: number): void {
    let currentNode: TreeNode | null = node;
    if (LOG_LEVEL === 1) {
        console.log("[LOG] Backpropagating result: ", result, " from node: ", node.action?.name);
    }
  
    while (currentNode !== null) {
        currentNode.visits += 1;
        currentNode.score += result;
        if (LOG_LEVEL === 1) {
            console.log("[LOG] Updated node: ", currentNode.action?.name, " -> Visits: ", currentNode.visits, ", Score: ", currentNode.score);
        }
        currentNode = currentNode.parent;
    }
  }

  monteCarloTreeSearch(root: TreeNode, iterations: number): [Action[], number, number] {
    let maxDamage = 0;
    let bestActionSequenceInSearch: Action[] = [];
    let bestActionList: Action[] = [];
    let bestActionListStr: string = '';
    let bestActionListTime: number = 0;
    
    for (let i = 0; i < iterations; i++) {
        if (LOG_LEVEL === 1) {
            console.log(`[LOG] Iteration: ${i + 1}`);
        }
  
        let node = root;
  
        // Expand the root node if no children
        if (node.children.length === 0) {
            if (LOG_LEVEL === 1) {
                console.log("[LOG] Root node has no children. Expanding root.");
            }
            this.expand(node);
        }
  
        // Select the best node (or one to expand if no children)
        node = this.select(node);
  
        // Ensure node is expanded if no children after selection
        if (node.children.length === 0) {
            this.expand(node);
        }
  
        // Simulate the outcome of the selected node
        const result = this.simulate(node);
  
        // Backpropagate the result to all parent nodes
        this.backpropagate(node, result);
  
        // Track the best damage and sequence from the MCTS loop as well
        if (result > maxDamage) {
            maxDamage = result;
            bestActionSequenceInSearch = node.actionSequence.slice(); // Copy the best sequence found in this iteration
            if (LOG_LEVEL === 1) {
                console.log(`[LOG] Updated best sequence: ${bestActionSequenceInSearch.map(a => a.name).join(" * ")}`);
            }
        }
    }
  
    // Return the best action list found in the entire MCTS process
    bestActionList = this.bestActionSequence.slice(0, 10); // Slice to the first 10 actions to clean up logs
    bestActionListStr = bestActionList.map(a => a.name).join(" + ");
    if (LOG_LEVEL === 1) {
      alert(`Optimizer complete, ran for ${iterations} itterations. \n Best action list: ${bestActionListStr} with Damage: ${this.bestDamage} `);
    }
    console.log(`[LOG] Best action list: ${bestActionListStr}`);
    console.log(`[LOG] Best found damage: ${this.bestDamage}`);
  
    return [this.bestActionSequence, this.bestDamage, this.bestTime]; // Or any other logic to return the final best node
  }

  constructor(job: string, setting: string, duration: number, gcd: number, iterations: number) {
      this.job = job;
      this.setting = setting;
      this.duration = duration;
      this.gcd = gcd;
      this.bestActions = [];
      this.bestPotency = -Infinity;
      this.bestDamage = -Infinity;
      this.bestActionSequence = [];
      this.actions = getJobActions(this.job);
      this.iterations = iterations;

    // Root node (starting point of the tree)
    this.root = {
        action: null,
        parent: null,
        children: [],
        visits: 0,
        score: 0,
        actionSequence: []
    };


      // For now, just alert the received values
      if (LOG_LEVEL === 1) {
        alert(`MCTS Initialized:\nJob: ${this.job}\nSetting: ${this.setting}\nDuration: ${this.duration} seconds\nGCD: ${this.gcd} seconds\nIterations: ${this.iterations}`);
      }
      
      // Fetch job actions and start MCTS optimization
      const result = this.monteCarloTreeSearch(this.root, iterations);
      this.bestActions = result[0];
      this.bestPotency = result[1];
      this.bestTime = result[2];
  }
}
