import type { RoutingEdge, RoutingNode } from '../types/security';

export interface DijkstraStep {
  visitedNode: string;
  currentCost: number;
  distancesSnapshot: Record<string, number>;
}

export interface DijkstraResult {
  found: boolean;
  path: string[];
  edgeIds: string[];
  totalCost: number;
  steps: DijkstraStep[];
}

/**
 * Computes the shortest path between sourceId and targetId using Dijkstra's algorithm.
 * Supports excluding disabled/congested edges for live network resilience simulation.
 */
export function runDijkstra(
  nodes: RoutingNode[],
  edges: RoutingEdge[],
  sourceId: string,
  targetId: string,
  disabledEdgeIds: Set<string> = new Set()
): DijkstraResult {
  const distances: Record<string, number> = {};
  const previousNode: Record<string, string | null> = {};
  const previousEdge: Record<string, string | null> = {};
  const unvisited = new Set<string>();
  const steps: DijkstraStep[] = [];

  for (const node of nodes) {
    distances[node.id] = node.id === sourceId ? 0 : Infinity;
    previousNode[node.id] = null;
    previousEdge[node.id] = null;
    unvisited.add(node.id);
  }

  // Build adjacency list from active edges (undirected hospital network links)
  const adjacency: Record<string, Array<{ neighbor: string; cost: number; edgeId: string }>> = {};
  for (const node of nodes) {
    adjacency[node.id] = [];
  }
  for (const edge of edges) {
    if (disabledEdgeIds.has(edge.id)) continue;
    adjacency[edge.from]?.push({ neighbor: edge.to, cost: edge.cost, edgeId: edge.id });
    adjacency[edge.to]?.push({ neighbor: edge.from, cost: edge.cost, edgeId: edge.id });
  }

  while (unvisited.size > 0) {
    let closestNode: string | null = null;
    let smallestDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < smallestDistance) {
        smallestDistance = distances[nodeId];
        closestNode = nodeId;
      }
    }

    if (closestNode === null || smallestDistance === Infinity) {
      break;
    }

    unvisited.delete(closestNode);
    steps.push({
      visitedNode: closestNode,
      currentCost: smallestDistance,
      distancesSnapshot: { ...distances },
    });

    if (closestNode === targetId) {
      break;
    }

    for (const link of adjacency[closestNode] || []) {
      if (!unvisited.has(link.neighbor)) continue;
      const candidateDistance = distances[closestNode] + link.cost;
      if (candidateDistance < distances[link.neighbor]) {
        distances[link.neighbor] = candidateDistance;
        previousNode[link.neighbor] = closestNode;
        previousEdge[link.neighbor] = link.edgeId;
      }
    }
  }

  if (distances[targetId] === Infinity) {
    return {
      found: false,
      path: [],
      edgeIds: [],
      totalCost: Infinity,
      steps,
    };
  }

  const path: string[] = [];
  const edgeIds: string[] = [];
  let cursor: string | null = targetId;

  while (cursor !== null) {
    path.unshift(cursor);
    const edgeId = previousEdge[cursor];
    if (edgeId) {
      edgeIds.unshift(edgeId);
    }
    cursor = previousNode[cursor];
  }

  return {
    found: true,
    path,
    edgeIds,
    totalCost: distances[targetId],
    steps,
  };
}

