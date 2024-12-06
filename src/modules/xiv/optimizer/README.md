# All about the optimizer 

When designing the optimizer we needed to select an optimization algorithm. We considered several approaches, including brute force, deep learning, and simulated annealing, before deciding on Monte Carlo Tree Search (MCTS). Brute force was immediately ruled out due to the astronomical number of possible rotations (far exceeding a googolplex) making exhaustive search computationally infeasible. Deep learning, while powerful in some domains, was unsuitable for this project because it would require retraining after every game update, a frequent occurrence in FFXIV that introduces new abilities, rebalances existing ones, or changes job mechanics. Simulated annealing, another optimization approach, was considered but ultimately rejected due to its tendency to struggle with problems involving highly interdependent variables, such as rotation sequences with intricate cooldown and combo mechanics.

We selected MCTS because it is particularly well-suited for tackling large, complex problems with many possible outcomes. One of its key advantages is that it does not require domain-specific knowledge of FFXIV mechanics to function—it only needs to interact with the potency calculator to evaluate potential rotations. This made it both easier to implement and highly adaptable to updates or extensions. Additionally, MCTS can produce useful results quickly, while its performance improves with additional iterations, offering flexibility in time-constrained scenarios. Historically, MCTS has been chosen to solve similarly complex problems, such as game-playing strategies in Go and chess, making it a reliable and proven choice for the complex task of rotation optimization.

MCTS operates through four iterative steps: select, expand, simulate, and backpropagate, refining its understanding of the optimal sequence with each iteration. This is visualized in the image

![MCTS Visualization](../../../assets/mcts_figure.png)

The process begins with the select phase, where the optimizer navigates the decision tree starting from the root. Nodes are chosen based on their visit count and score, balancing the need to explore unvisited sequences with the potential of revisiting promising paths. This ensures that both new possibilities and high-scoring rotations receive attention. Each selected node represents a specific action in the rotation and acts as a baseline for further improvements.

In the expand phase, the optimizer adds new child nodes to the selected node. Each child represents a valid follow-up action from the current sequence. Validity is determined by the calculator written by the previous group. This systematic expansion of possible next steps mirrors how a player might manually consider logical progressions in their rotation. Essentially, in this phase, the optimizer builds out the entirety of the tree in preparation for future steps.

The simulate phase once again utilizes the calculator written by the previous group to evaluate the effectiveness of action sequences. Starting from the selected node’s rotation, the optimizer appends random but valid actions until the total duration is reached. The calculator verifies the validity of the sequence and computes its potency. This phase directly ties into the project’s goal by automating the labor-intensive process of manually constructing and testing rotations, as only valid and effective combinations are considered.

Finally, in the backpropagate phase, the optimizer updates the scores and visit counts of all nodes leading back to the root. Each node's score reflects the potency of the sequence it represents, allowing the algorithm to prioritize nodes that contribute to higher damage. This feedback loop allows the optimizer to prioritize paths that are more effective over paths that are not. 

The optimizer’s effectiveness is determined by the number of iterations. With each iteration, the algorithm explores new paths or refines existing ones, progressively improving its understanding of the tree. Early iterations offer a basic understanding of viable options, while longer runs allow the optimizer to refine its results and find rotations that are either optimal or very close to it. This is uniquely suited to our project, as it’s quite easy to find an acceptably powerful rotation during the 15 minute time period described in the functional requirements, but hardcore players could potentially input a massive number of iterations and leave it running overnight to find something that approaches optimal or truly is optimal.

As stated above, one of the most notable advantages of MCTS over similar optimization algorithms is the fact that the algorithm itself does not encode any of the game rules. The optimizer relies on the calculator solely for validating action sequences and computing their potency. This separation guarantees that updates to the calculator, such as adjustments for new game patches, balance changes, or expanded functionality, can be implemented independently without requiring changes to the optimizer’s core logic. This modular approach enhances maintainability, reduces the risk of breaking functionality when the game is updated, and is overall the best approach to guarantee flexibility and continued functionality.