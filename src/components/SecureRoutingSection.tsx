import React, { useMemo, useState } from 'react';
import { AlertCircle, ArrowRight, GitBranch, Navigation, Route, Zap } from 'lucide-react';
import { ROUTING_EDGES, ROUTING_NODES } from '../data/hospitalData';
import { runDijkstra } from '../utils/dijkstra';
import { SectionHeader } from './SectionHeader';

interface SecureRoutingSectionProps {
  ospfHighlightSignal?: number;
}

export const SecureRoutingSection: React.FC<SecureRoutingSectionProps> = ({
  ospfHighlightSignal = 0,
}) => {
  const [sourceId, setSourceId] = useState<string>('emergency');
  const [destinationId, setDestinationId] = useState<string>('central_db');
  const [disabledLinks, setDisabledLinks] = useState<Set<string>>(new Set());
  const [activeRoute, setActiveRoute] = useState(() =>
    runDijkstra(ROUTING_NODES, ROUTING_EDGES, 'emergency', 'central_db')
  );

  // Trigger a dynamic OSPF failover demonstration when jumped from the OSPF card
  React.useEffect(() => {
    if (ospfHighlightSignal > 0) {
      const failoverLinks = new Set<string>(['re-9']); // Core Router -> Records Server outage demo
      setDisabledLinks(failoverLinks);
      setSourceId('emergency');
      setDestinationId('central_db');
      setActiveRoute(
        runDijkstra(ROUTING_NODES, ROUTING_EDGES, 'emergency', 'central_db', failoverLinks)
      );
    }
  }, [ospfHighlightSignal]);

  const nodeMap = useMemo(
    () => Object.fromEntries(ROUTING_NODES.map((n) => [n.id, n])),
    []
  );

  const handleFindRoute = () => {
    const result = runDijkstra(ROUTING_NODES, ROUTING_EDGES, sourceId, destinationId, disabledLinks);
    setActiveRoute(result);
  };

  const toggleEdgeOutage = (edgeId: string) => {
    const next = new Set(disabledLinks);
    if (next.has(edgeId)) {
      next.delete(edgeId);
    } else {
      next.add(edgeId);
    }
    setDisabledLinks(next);
    setActiveRoute(runDijkstra(ROUTING_NODES, ROUTING_EDGES, sourceId, destinationId, next));
  };

  const resetAllLinks = () => {
    const empty = new Set<string>();
    setDisabledLinks(empty);
    setActiveRoute(runDijkstra(ROUTING_NODES, ROUTING_EDGES, sourceId, destinationId, empty));
  };

  const activePathNodes = new Set(activeRoute.path);
  const activePathEdges = new Set(activeRoute.edgeIds);

  return (
    <section id="secure-routing" className="scroll-mt-20 lg:scroll-mt-8">
      <SectionHeader
        badge="Dijkstra SPF & OSPF Routing"
        title="Secure Routing Engine"
        subtitle="Select any source and destination department to compute the lowest-cost, lowest-latency secure route using a live Dijkstra Shortest-Path algorithm."
        simBadge="Working Dijkstra Algorithm"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Controls + Visual Graph */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-5">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Source Department
              </label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#050E1B] px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
              >
                {ROUTING_NODES.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label} ({node.ospfArea})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Destination Department
              </label>
              <select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#050E1B] px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
              >
                {ROUTING_NODES.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label} ({node.ospfArea})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleFindRoute}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-teal-400 cursor-pointer"
              >
                <Navigation className="h-4 w-4" />
                FIND SECURE ROUTE
              </button>
            </div>
          </div>

          {/* Interactive Weighted Graph SVG */}
          <div className="rounded-xl border border-slate-800 bg-[#050E1B] overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 px-4 py-2 text-[11px] text-slate-400">
              <span>Tip: Click any link cost badge to simulate an OSPF link outage &amp; instant reroute</span>
              {disabledLinks.size > 0 && (
                <button
                  type="button"
                  onClick={resetAllLinks}
                  className="text-cyan-300 hover:underline font-medium cursor-pointer"
                >
                  Restore {disabledLinks.size} Disabled Link(s)
                </button>
              )}
            </div>

            <svg viewBox="0 0 870 465" className="w-full h-auto select-none">
              {/* OSPF Area Visual Regions */}
              <rect
                x="18"
                y="24"
                width="160"
                height="275"
                rx="16"
                fill="rgba(34,211,238,0.03)"
                stroke="rgba(34,211,238,0.16)"
                strokeDasharray="4 4"
              />
              <text x="98" y="44" textAnchor="middle" className="fill-cyan-300/60 text-[10px] font-mono">
                OSPF Area 1 (Clinical)
              </text>

              <rect
                x="232"
                y="85"
                width="400"
                height="350"
                rx="18"
                fill="rgba(59,130,246,0.035)"
                stroke="rgba(59,130,246,0.2)"
                strokeDasharray="5 4"
              />
              <text x="432" y="106" textAnchor="middle" className="fill-sky-300/65 text-[10px] font-mono">
                OSPF Area 0 (Secure Backbone)
              </text>

              {/* Edges */}
              {ROUTING_EDGES.map((edge) => {
                const n1 = nodeMap[edge.from];
                const n2 = nodeMap[edge.to];
                const isDisabled = disabledLinks.has(edge.id);
                const isPath = activePathEdges.has(edge.id);
                const midX = (n1.x + n2.x) / 2;
                const midY = (n1.y + n2.y) / 2;

                return (
                  <g
                    key={edge.id}
                    onClick={() => toggleEdgeOutage(edge.id)}
                    className="cursor-pointer"
                  >
                    <line
                      x1={n1.x}
                      y1={n1.y}
                      x2={n2.x}
                      y2={n2.y}
                      stroke={isDisabled ? '#EF4444' : isPath ? '#2DD4BF' : '#1E3A5F'}
                      strokeWidth={isPath ? 4.5 : 2}
                      strokeDasharray={isDisabled ? '5 5' : undefined}
                      strokeOpacity={isDisabled ? 0.65 : isPath ? 0.95 : 0.75}
                    />
                    {isPath && !isDisabled && (
                      <line
                        x1={n1.x}
                        y1={n1.y}
                        x2={n2.x}
                        y2={n2.y}
                        stroke="#A7F3D0"
                        strokeWidth="2.2"
                        className="animate-flow-dash-fast"
                      />
                    )}
                    {/* Cost Pill */}
                    <circle
                      cx={midX}
                      cy={midY}
                      r="12"
                      fill={isDisabled ? '#450A0A' : isPath ? '#064E3B' : '#0B1B33'}
                      stroke={isDisabled ? '#F87171' : isPath ? '#34D399' : '#38BDF8'}
                      strokeWidth="1.4"
                    />
                    <text
                      x={midX}
                      y={midY + 3.5}
                      textAnchor="middle"
                      className={`text-[10px] font-mono font-bold ${
                        isDisabled ? 'fill-rose-300' : isPath ? 'fill-emerald-200' : 'fill-cyan-200'
                      }`}
                    >
                      {isDisabled ? 'X' : edge.cost}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {ROUTING_NODES.map((node) => {
                const isSource = node.id === sourceId;
                const isDest = node.id === destinationId;
                const inPath = activePathNodes.has(node.id);

                const stroke = isSource
                  ? '#22D3EE'
                  : isDest
                  ? '#10B981'
                  : inPath
                  ? '#2DD4BF'
                  : '#334155';

                const fill = isSource
                  ? '#0E3A5C'
                  : isDest
                  ? '#064E3B'
                  : inPath
                  ? '#0B2F3A'
                  : '#0B192E';

                return (
                  <g key={node.id}>
                    <rect
                      x={node.x - 58}
                      y={node.y - 22}
                      width="116"
                      height="44"
                      rx="11"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth={isSource || isDest || inPath ? 2.4 : 1.4}
                    />
                    <text
                      x={node.x}
                      y={node.y - 2}
                      textAnchor="middle"
                      className="fill-white text-[11px] font-semibold"
                    >
                      {node.shortLabel}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 13}
                      textAnchor="middle"
                      className="fill-cyan-300/80 text-[9.5px] font-mono"
                    >
                      {isSource ? 'SOURCE' : isDest ? 'DESTINATION' : node.ospfArea}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Route Output + Simple English Explanations */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Route className="h-4 w-4 text-emerald-400" />
              Computed Optimal Secure Path
            </h3>

            {activeRoute.found ? (
              <>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <div className="text-[11px] text-emerald-200/80">Total Path Cost</div>
                    <div className="mt-0.5 font-display text-2xl font-bold text-emerald-300">
                      {activeRoute.totalCost}{' '}
                      <span className="text-xs font-mono font-normal">cost units</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
                    <div className="text-[11px] text-cyan-200/80">Network Hops</div>
                    <div className="mt-0.5 font-display text-2xl font-bold text-cyan-300">
                      {Math.max(0, activeRoute.path.length - 1)}{' '}
                      <span className="text-xs font-mono font-normal">hops</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Highlighted Shortest Path
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeRoute.path.map((nodeId, idx) => (
                      <React.Fragment key={nodeId}>
                        <span className="rounded-lg border border-teal-500/35 bg-teal-500/15 px-2.5 py-1 text-xs font-semibold text-teal-200">
                          {nodeMap[nodeId]?.shortLabel ?? nodeId}
                        </span>
                        {idx < activeRoute.path.length - 1 && (
                          <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-800 bg-[#050E1B] p-3 text-xs text-slate-300">
                  <span className="font-semibold text-cyan-300">Dijkstra Steps Evaluated: </span>
                  Visited {activeRoute.steps.length} nodes in increasing cumulative cost order until
                  locking in{' '}
                  <span className="font-semibold text-emerald-300">
                    {nodeMap[destinationId]?.shortLabel}
                  </span>
                  .
                </div>
              </>
            ) : (
              <div className="mt-3 rounded-xl border border-rose-500/35 bg-rose-500/10 p-3 text-xs text-rose-200 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  No reachable route exists because critical links are disabled. Restore a link to
                  allow OSPF convergence.
                </span>
              </div>
            )}
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div>
              <h4 className="font-display text-sm font-bold text-cyan-300 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Dijkstra&apos;s Algorithm (Simple English)
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                Think of link costs like travel time on hospital corridors. Starting from the source
                department with cost 0, Dijkstra checks neighboring switches, picks the cheapest
                unvisited path next, and repeats until it locks in the guaranteed fastest route to
                the destination.
              </p>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <h4 className="font-display text-sm font-bold text-indigo-300 flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                OSPF Routing in Hospital Areas
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                <strong>OSPF (Open Shortest Path First)</strong> groups hospital wings into Areas
                (Area 1 Clinical, Area 2 Diagnostics, Area 0 Backbone). Routers share live link
                status updates and re-run Dijkstra automatically whenever a cable or switch goes
                down, keeping patient care online.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

