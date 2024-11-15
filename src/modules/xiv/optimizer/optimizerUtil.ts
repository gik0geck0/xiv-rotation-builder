import type { Action } from 'xiv/actionData';
import { getJobActions } from 'xiv/actionRepository';

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

 // MCTS core functions

 // Function to calculate the score based on action potency
 score(actions: Action[]): number {
    if (LOG_LEVEL === 1) {
        console.log("[LOG] Calculating score for actions: ", actions.map(a => a.name));
    }
    
    // Calculate the score based on potency (or any other metric you are using)
    const damage = actions.reduce((acc, action) => acc * (Number(action.potencyNumeric) || 1), 1);
  
    // Check if the current damage is better than the best known damage
    if (damage > this.bestDamage) {
        this.bestDamage = damage; // Update the best damage
        this.bestActionSequence = [...actions]; // Update the best action sequence
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
  
    const selectedNode = node.children.reduce((bestChild, currentChild) => 
      currentChild.visits === 0 ? currentChild : (bestChild.score > currentChild.score ? bestChild : currentChild),
      node.children[0] // Ensure we have at least one child to avoid empty reduce
    );
  
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
  
    while (randomActions.length < 10) {
        const randomAction = this.weightedRandomAction();
        randomActions.push(randomAction);
        if (LOG_LEVEL === 1) {
            console.log("[LOG] Added action during simulation: ", randomAction.name);
        }
    }
  
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
weightedRandomAction(): Action {
    let weightedActions: { action: Action, weight: number }[];
    const baseWeight = 100;

    if (this.setting === "breadth") {
        // Weights are more uniform, but include potency to a lesser degree
        weightedActions = this.actions.map(action => ({
            action,
            weight: baseWeight + (action.potencyNumeric || 0) * .2
        }));
    } else if (this.setting === "depth") {
        // Weights are proportional to potency to prioritize depth
        weightedActions = this.actions.map(action => ({
            action,
            weight: (action.potencyNumeric || 0) * 2
        }));
    } else if (this.setting === "balanced") {
        // Accounts for potencies but also maintains some uniformity
        weightedActions = this.actions.map(action => ({
            action,
            weight: baseWeight + (action.potencyNumeric || 0) * .5
        }));
    } else {
        // Default to using potency as weight
        weightedActions = this.actions.map(action => ({
            action,
            weight: (action.potencyNumeric || 0)
        }));
    }

    // Calculate cumulative weights for random selection
    const totalWeightedScore = weightedActions.reduce((sum, entry) => sum + entry.weight, 0);
    const randomValue = Math.random() * totalWeightedScore;

    let cumulative = 0;
    for (const entry of weightedActions) {
        cumulative += entry.weight;
        if (cumulative >= randomValue) // and calculatePotency doesn't throw an error for that action
        {
            return entry.action;
        }
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

  monteCarloTreeSearch(root: TreeNode, iterations: number): [Action[], number] {
    let maxDamage = 0;
    let bestActionSequenceInSearch: Action[] = [];
    let bestActionList: Action[] = [];
    let bestActionListStr: string = '';
  
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
    bestActionList = this.bestActionSequence.slice(0, 10); // Slice to the first 10 actions if necessary
    bestActionListStr = bestActionList.map(a => a.name).join(" * ");
    if (LOG_LEVEL === 1) {
      alert(`Optimizer complete, ran for ${iterations} itterations. \n Best action list: ${bestActionListStr} with Damage: ${this.bestDamage} `);
    }
    console.log(`[LOG] Best action list: ${bestActionListStr}`);
    console.log(`[LOG] Best found damage: ${this.bestDamage}`);
  
    return [bestActionList, this.bestDamage]; // Or any other logic to return the final best node
  }

  constructor(job: string, setting: string, duration: number, gcd: number) {
      this.job = job;
      this.setting = setting;
      this.duration = duration;
      this.gcd = gcd;
      this.bestActions = [];
      this.bestPotency = -Infinity;
      this.bestDamage = -Infinity;
      this.bestActionSequence = [];
      this.actions = getJobActions(this.job);

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
        alert(`MCTS Initialized:\nJob: ${this.job}\nSetting: ${this.setting}\nDuration: ${this.duration} seconds\nGCD: ${this.gcd} seconds`);
      }
      
      // Fetch job actions and start MCTS optimization
      const result = this.monteCarloTreeSearch(this.root, 100000);
      this.bestActions = result[0];
      this.bestPotency = result[1];
  }
}
