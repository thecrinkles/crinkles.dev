---
title: Updating my graph layout algorithm
date: 2023-01-05
tags:
  - javascript
layout: post
description: >-
  Updating my graph layout algorithm based on new requirements and requests from the community
---

In July 2021 I wrote an article about an [auto-layout algorithm](/writing/auto-graph-layout-algorithm) I needed for the visual state machine editor. I published the implementation as a package called [DIGL](https://github.com/thecrinkles/digl). I never expected it to have any success. In reality, it became my first package that got some community interaction. But with community interaction, come new use cases on how to use the package. Some examples:

- Improve the performance of complex graphs
- Make it work for multiple disconnected graphs
- Make it work for graphs with more than one starting node

::: callout
A _rank_ is a list of nodes, a _ranking_ is a list of ranks, and a _graph_ is a list of rankings.
:::

## Summary of the previous algorithm

Let’s first revisit the original heuristic implemented in DIGL. It is a simple multistep algorithm to find a _local_ optimum for very complex graphs. For simple graphs, the actual optimum is often found.

1. Determine the initial rank of each node. The rank of a node equals the length of the shortest route between this node and the initial node. The rank can be determined using a [breadth-first search algorithm](https://en.wikipedia.org/wiki/Breadth-first_search).
2. Determine all possible paths from the source node, using a [depth-first search algorithm](https://en.wikipedia.org/wiki/Depth-first_search), as displayed below.
3. Order all nodes within a rank, based on their occurrence in the longest path. Nodes in longer paths are placed higher within a rank.
4. Swap two nodes within a rank, and determine if the number of crossing edges is the same or reduced. If so, keep the swapped nodes and move to the next two nodes.
5. Determine if the new graph is optimized compared to the old one. If so, repeat step 4 (a maximum of ten times). When the same score is found on the first iteration, repeat step 4 again.

## Improve the initial ranking

Although effective, the heuristic does have several issues or points of improvement. The breath-first search algorithm used in the first step is exciting to create. But after running tests with several example graphs, it is much more effective to rank nodes based on the _longest_ path from the source, instead of the shortest. This can be achieved by getting all the paths from the source and finding the largest index for each node.

```ts
nodes.forEach((n) => {
  const _paths = paths.filter((p) => p.includes(n.id));
  if (!_paths.length) return;

  const index = _paths.reduce((acc, path) => {
    const i = path.findIndex((p) => p === n.id);
    return i > acc ? i : acc;
  }, 0);

  ranks[index] = [...(ranks[index] || []), n.id];
});
```

At one point the library even supported the option to choose between the two initial ranking methods. But, this means an inferior method needs to be maintained, only because I liked the implementation myself. This is a classic case of over-engineering. One easily avoidable.

Interestingly, by removing the option of starting with the shortest path, the algorithm gets simplified even further. As you can see, the original second step was to get all the paths and use those to order nodes within a rank. By ranking nodes based on their longest path from the source, this is automatically done. By switching to the _longest_ path method, we not only require fewer iterations to find a local optimum. The execution of a single iteration is optimized as well.

## Multiple independent graphs

The original library required you to identify the source node of the graph yourself. This means it could only support a single graph. Floating nodes or two graphs in one view were not supported by the package.

```ts
nodes.filter((n) => !edges.find((e) => e.target === n.id));
```

This works well for most cases. But, as pointed out to a user from the library in [this issue](https://github.com/thecrinkles/digl/issues/21), it has some flaws. Whenever even one graph is a full loop, i.e. each node is a target once or more, it will not produce a correct result. In the issue, there were two graphs, one simple graphs with a clear source. And a graph that was a big loop. With the above method all nodes from the big loop were left out of the final result. This means a different solution has to be found.

1. Start looking for all definitive sources with the above snippet.
2. Get all possible paths per source. This can be used to create the initial ranking per source, as described earlier.
3. Based on all the found paths, determine which nodes are _not_ yet visited with one of the paths (see code snippet below). If no unvisited nodes are found, skip step 4.
4. Flag the first node as a source and find all paths. Redo step 3.
5. For each source, determine the initial ranking based on all possible paths.

```ts
function diff<T>(a: T[], b: T[]): T[] {
  const setA = new Set([...a]);
  const setB = new Set([...b]);
  const diff = new Set([...setA].filter((x) => !setB.has(x)));
  return Array.from(diff);
}
```

With these steps, we ensure all nodes are now part of the result. Because all nodes are part of the result, we know all edges are covered. The difference now is that instead of a single _ranking_, we have an array of _rankings_. One ranking for each found source node

## Multiple source nodes for a single graph

Having multiple rankings, one for each source node, with the above method works when we know they are independent. But when two rankings share a node, we will hit issues. When visualizing the output, nodes will be duplicated, confusing users. State machines can have multiple source nodes for a single graph, for example. This means we need an additional step after finding the ranking for each source node.

Merging rankings when they intersect can be achieved by iterating over all combinations of source nodes and their possible paths. Take a look at this example. If `I` and `J` intersect, and `J` and `K`, all three need to be combined. But, using a double `for-`loop will not find `I` and `K`. A recursive function is used.

```ts
function merge(paths, nodes) {
  const _paths = [];
  const _merged = [];

  for (let i = 0; i < paths.length; i++) {
    if (_merged.includes(i)) continue;
    const _mergedpaths = [...paths[i]];
    for (let j = i + 1; j < paths.length; j++) {
      if (intersect(paths[i], paths[j]).length) {
        _mergedpaths.push(...paths[j]);
        _merged.push(j);
      }
    }
    _paths.push(_mergedpaths);
  }

  if (_paths.length === paths.length) return _paths;
  return merge(_paths, nodes);
}
```

Once we found two rankings that intersect, we combine all the paths of those two rankings into a new list. This new list of paths can be used to determine a new initial ranking for the combined rankings.

## Wrapping up

When combining the above changes to the algorithm, we actually get a new algorithm. a completely new algorithm can be found, with an optimized focus on all steps before the actual optimization starts.

1. Determine all source nodes
2. Determine for each source node all possible paths
3. Determine overlap in the paths for each source node and merge them (recursively)
4. Determine the initial ranking for the different sets of paths
5. Optimize each of the rankings

This new optimized algorithm creates a new range of possibilities to use DIGL. It can now be used to visualize more complex state machines, petri-nets, or directed graphs.
