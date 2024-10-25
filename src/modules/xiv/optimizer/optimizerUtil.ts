// This is a POC for MCTS, not using XIV actions, but using these dummy actions
// It tries to find the best sequence of actions, right now it just multiplies the actions damages togeather in order
// Higher itterations tend to find much better damages
type Action = {
    name: string;
    damage: number;
  };
  
  type TreeNode = {
    action: Action | null;
    parent: TreeNode | null;
    children: TreeNode[];
    visits: number;
    score: number;
    actionSequence: Action[]; // Track sequence of actions leading to this node
  };
  
  // Expanded example actions
  const actions: Action[] = [
    { name: "Punch", damage: 2 },
    { name: "Kick", damage: 3 },
    { name: "Headbutt", damage: 4 },
    { name: "Slap", damage: 1 },
    { name: "Elbow Strike", damage: 5 },
    { name: "Knee Strike", damage: 4 },
    { name: "Shoulder Charge", damage: 6 },
    { name: "Backfist", damage: 2 },
    { name: "Roundhouse Kick", damage: 5 },
    { name: "Throw", damage: 3 }
  ];
  
  // Set log level (1 for verbose, 0 for summary)
  const LOG_LEVEL = 0;
  
  // Function to calculate the score by multiplying damages in order
  function score(actions: Action[]): number {
    if (LOG_LEVEL === 1) {
      console.log("[LOG] Calculating score for actions: ", actions.map(a => a.name));
    }
    return actions.reduce((acc, action) => acc * action.damage, 1); // Start with 1 to avoid reducing an empty array
  }
  
  // Monte Carlo Tree Search core functions
  
  // Selection: choose the best child node (based on UCB1 or similar heuristic)
  function select(node: TreeNode): TreeNode {
    if (LOG_LEVEL === 1) {
      console.log("[LOG] Selecting node. Current children: ", node.children.map(c => c.action?.name));
    }
    if (node.children.length === 0) {
      if (LOG_LEVEL === 1) {
        console.log("[LOG] No children found during selection!");
      }
      return node; // No selection possible
    }
  
    // Return the child with the highest score
    const selectedNode = node.children.reduce((bestChild, currentChild) => 
      currentChild.visits === 0 ? currentChild : (bestChild.score > currentChild.score ? bestChild : currentChild),
      node.children[0] // Ensure we have at least one child to avoid empty reduce
    );
  
    if (LOG_LEVEL === 1) {
      console.log("[LOG] Selected node: ", selectedNode.action?.name);
    }
    return selectedNode;
  }
  
  // Expansion: create a new child node for each unexplored action
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
  
  // Simulation: fixed length of actions and calculate score
  function simulate(node: TreeNode): number {
    if (LOG_LEVEL === 1) {
      console.log("[LOG] Simulating from node: ", node.action?.name);
    }
  
    const randomActions: Action[] = [...node.actionSequence]; // Start with the sequence from this node
  
    // Ensure we fill up to 10 actions in total
    while (randomActions.length < 10) {
      const randomAction = weightedRandomAction(); // Use weighted random selection
      randomActions.push(randomAction);
      if (LOG_LEVEL === 1) {
        console.log("[LOG] Added action during simulation: ", randomAction.name);
      }
    }
  
    if (LOG_LEVEL === 1) {
      console.log("[LOG] Simulated actions (in order): ", randomActions.map(a => a.name));
    }
    const calculatedScore = score(randomActions); // Multiply damages
    if (LOG_LEVEL === 1) {
      console.log("[LOG] Simulated score: ", calculatedScore);
    }
    return calculatedScore;
  }
  
  // Weighted random selection of actions based on previous scores
  function weightedRandomAction(): Action {
    const totalScore = actions.reduce((sum, action) => sum + action.damage, 0);
    const randomValue = Math.random() * totalScore;
  
    let cumulative = 0;
    for (const action of actions) {
      cumulative += action.damage; // Use action damage as weight
      if (cumulative >= randomValue) {
        return action; // Return the chosen action based on weight
      }
    }
    
    // Fallback (should not occur)
    return actions[0]; // Return the first action as a fallback
  }
  
  // Backpropagation: propagate score back up the tree
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
      currentNode = currentNode.parent; // Move up to the parent node
    }
  }
  
  // MCTS main loop
  function monteCarloTreeSearch(root: TreeNode, iterations: number): TreeNode {
    let maxDamage = 0; // To track the maximum damage found
    let bestActionSequence: Action[] = []; // To track the best action sequence
  
    for (let i = 0; i < iterations; i++) {
      if (LOG_LEVEL === 1) {
        console.log(`[LOG] Iteration: ${i + 1}`);
      }
  
      // Selection
      let node = root;
  
      if (node.children.length === 0) {
        if (LOG_LEVEL === 1) {
          console.log("[LOG] Root node has no children. Expanding root.");
        }
        expand(node);
      }
  
      node = select(root);
  
      // Expansion
      if (node.children.length === 0) {
        expand(node);
      }
  
      // Simulation
      const result = simulate(node);
  
      // Backpropagation
      backpropagate(node, result);
  
      // Track the best sequence and max damage
      if (result > maxDamage) {
        maxDamage = result; // Update maximum damage found
        bestActionSequence = node.actionSequence; // Update the best action sequence
      }
    }
  
    // Return the best child (based on highest score)
    const bestNode = root.children.reduce((bestChild, currentChild) => 
      bestChild.score > currentChild.score ? bestChild : currentChild
    );
  
    const actionList = bestNode.actionSequence.map(a => `${a.name} ${a.damage}`).join(" * ");
    
    if (LOG_LEVEL === 1) {
      console.log("[LOG] Best node after MCTS: ", bestNode.action?.name, " with score: ", bestNode.score);
    }
  
    // Output the best found sequence and damage
    const bestActionList = bestActionSequence.map(a => `${a.name} ${a.damage}`).join(" * ");
    //console.log(`[LOG] Best action sequence: ${bestActionList} = ${maxDamage}`);
    console.log(`[LOG] Best found damage: ${maxDamage}`); // Output the best found damage
  
    return bestNode;
  }
  
  // Root node (starting point of the tree)
  const root: TreeNode = {
    action: null,
    parent: null,
    children: [],
    visits: 0,
    score: 0,
    actionSequence: [] // Initialize with an empty sequence
  };
  
  // Try running MCTS with 1 10 100 10000 iterations 
  const bestNode = monteCarloTreeSearch(root, 10000);
  