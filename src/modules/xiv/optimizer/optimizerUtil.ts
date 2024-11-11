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
const LOG_LEVEL: LogLevel = 1;

let actions: Action[];
let bestDamage: number = -Infinity; // Start with an impossible low value
let bestActionSequence: Action[] = []; // Best sequence, starts empty

// Function to calculate the score based on action potency
function score(actions: Action[]): number {
  if (LOG_LEVEL === 1) {
      console.log("[LOG] Calculating score for actions: ", actions.map(a => a.name));
  }
  
  // Calculate the score based on potency (or any other metric you are using)
  const damage = actions.reduce((acc, action) => acc * (Number(action.potencyNumeric) || 1), 1);

  // Check if the current damage is better than the best known damage
  if (damage > bestDamage) {
      bestDamage = damage; // Update the best damage
      bestActionSequence = [...actions]; // Update the best action sequence
      if (LOG_LEVEL === 1) {
          console.log("[LOG] New best sequence found:", bestActionSequence.map(a => a.name).join(" * "));
          console.log("[LOG] New best damage:", bestDamage);
      }
  }

  return damage;
}

// MCTS core functions

// Selects the best child node based on visits and score
// MCTS core functions
function select(node: TreeNode): TreeNode {
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
function expand(node: TreeNode): void {
  if (LOG_LEVEL === 1) {
      console.log("[LOG] Expanding node: ", node.action?.name);
  }

  actions.forEach(action => {
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
function simulate(node: TreeNode): number {
  if (LOG_LEVEL === 1) {
      console.log("[LOG] Simulating from node: ", node.action?.name);
  }

  const randomActions: Action[] = [...node.actionSequence]; // Start with the sequence from this node

  while (randomActions.length < 10) {
      const randomAction = weightedRandomAction();
      randomActions.push(randomAction);
      if (LOG_LEVEL === 1) {
          console.log("[LOG] Added action during simulation: ", randomAction.name);
      }
  }

  if (LOG_LEVEL === 1) {
      console.log("[LOG] Simulated actions (in order): ", randomActions.map(a => a.name));
  }
  const calculatedScore = score(randomActions); // This now updates the best sequence
  if (LOG_LEVEL === 1) {
      console.log("[LOG] Simulated score: ", calculatedScore);
  }
  return calculatedScore;
}


// Returns a randomly selected action based on weighted potency
function weightedRandomAction(): Action {
    const totalScore = actions.reduce((sum, action) => sum + (action.potencyNumeric || 0), 0);
    const randomValue = Math.random() * totalScore;

    let cumulative = 0;
    for (const action of actions) {
        cumulative += (action.potencyNumeric || 0); // Use potency as weight
        if (cumulative >= randomValue) {
            return action;
        }
    }

    return actions[0]; // Fallback
}

// Backpropagates the result of the simulation up the tree
function backpropagate(node: TreeNode, result: number): void {
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

function monteCarloTreeSearch(root: TreeNode, iterations: number): TreeNode {
  let maxDamage = 0;
  let bestActionSequenceInSearch: Action[] = [];

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
          expand(node);
      }

      // Select the best node (or one to expand if no children)
      node = select(node);

      // Ensure node is expanded if no children after selection
      if (node.children.length === 0) {
          expand(node);
      }

      // Simulate the outcome of the selected node
      const result = simulate(node);

      // Backpropagate the result to all parent nodes
      backpropagate(node, result);

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
  const bestActionList = bestActionSequence.slice(0, 10); // Slice to the first 10 actions if necessary
  const bestActionListStr = bestActionList.map(a => a.name).join(" * ");
  alert(`Optimizer complete, ran for ${iterations} itterations. \n Best action list: ${bestActionListStr} with Damage: ${bestDamage} `);
  console.log(`[LOG] Best action list: ${bestActionListStr}`);
  console.log(`[LOG] Best found damage: ${bestDamage}`);

  return root; // Or any other logic to return the final best node
}


// Root node (starting point of the tree)
const root: TreeNode = {
    action: null,
    parent: null,
    children: [],
    visits: 0,
    score: 0,
    actionSequence: []
};

// The MCTS optimizer class
export class MCTSOptimizer {
  job: string;
  setting: string;
  duration: number;
  gcd: number;

  constructor(job: string, setting: string, duration: number, gcd: number) {
      this.job = job;
      this.setting = setting;
      this.duration = duration;
      this.gcd = gcd;

      // For now, just alert the received values
      alert(
          `MCTS Initialized:\nJob: ${this.job}\nSetting: ${this.setting}\nDuration: ${this.duration} seconds\nGCD: ${this.gcd} seconds`
      );
      
      // Fetch job actions and start MCTS optimization
      actions = getJobActions(this.job);
      monteCarloTreeSearch(root, 1000);
  }
}
