import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Lock,
  MonitorCheck,
  Network,
  Server,
  Shield,
  Wifi,
} from 'lucide-react';
import { TOPOLOGY_LINKS, TOPOLOGY_NODES } from '../data/hospitalData';
import type { TopologyNode } from '../types/security';
import { SectionHeader } from './SectionHeader';

const ZONE_STYLE: Record<
  TopologyNode['zone'],
  { fill: string; stroke: string; badge: string; label: string }
> = {
  clinical: {
    fill: '#0D243F',
    stroke: '#22D3EE',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/35',
    label: 'Clinical / Hospital Dept',
  },
  security: {
    fill: '#171C3A',
    stroke: '#F59E0B',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
    label: 'Security Control Plane',
  },
  core: {
    fill: '#0B2B2D',
    stroke: '#10B981',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
    label: 'Core Data Tier',
  },
};

export const TopologySection: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('ids_server');

  const selectedNode =
    TOPOLOGY_NODES.find((node) => node.id === selectedNodeId) ?? TOPOLOGY_NODES[0];

  const nodeMap = Object.fromEntries(TOPOLOGY_NODES.map((n) => [n.id, n]));

  return (
    <section id="topology" className="scroll-mt-20 lg:scroll-mt-8">
      <SectionHeader
        badge="Interactive Infrastructure Map"
        title="Hospital Network Topology"
        subtitle="Click any hospital department, firewall, monitoring server, or database node to inspect live simulated security posture, VLAN segmentation, and active encryption protocols."
        simBadge="Interactive Topology Demo"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Interactive SVG Diagram */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 text-cyan-300">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                Clinical Departments (6)
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-300">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                Firewall & IDS Security (2)
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-300">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Records & Database Vault (2)
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Click any node to inspect
            </span>
          </div>

          <div className="rounded-xl border border-slate-800/90 bg-[#050E1B] overflow-hidden">
            <svg viewBox="0 0 900 490" className="w-full h-auto select-none">
              <defs>
                <radialGradient id="coreHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#050E1B" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Central Secure Backbone Zone */}
              <rect
                x="255"
                y="45"
                width="390"
                height="420"
                rx="22"
                fill="url(#coreHalo)"
                stroke="#1E3A5F"
                strokeDasharray="6 4"
                strokeWidth="1.5"
              />
              <text
                x="450"
                y="70"
                textAnchor="middle"
                className="fill-cyan-300/70 text-[11px] font-mono uppercase tracking-widest"
              >
                Zero-Trust Core Network &amp; OSPF Area 0
              </text>

              {/* Animated Connection Lines */}
              {TOPOLOGY_LINKS.map((link) => {
                const source = nodeMap[link.from];
                const target = nodeMap[link.to];
                const isConnectedToSelected =
                  link.from === selectedNodeId || link.to === selectedNodeId;

                return (
                  <g key={link.id}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isConnectedToSelected ? '#22D3EE' : '#1E3A5F'}
                      strokeWidth={isConnectedToSelected ? 3 : 2}
                      strokeOpacity={isConnectedToSelected ? 0.55 : 0.7}
                    />
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isConnectedToSelected ? '#2DD4BF' : '#38BDF8'}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1.5}
                      strokeOpacity={isConnectedToSelected ? 1 : 0.65}
                      className={isConnectedToSelected ? 'animate-flow-dash-fast' : 'animate-flow-dash'}
                    />
                  </g>
                );
              })}

              {/* Network Nodes */}
              {TOPOLOGY_NODES.map((node) => {
                const style = ZONE_STYLE[node.zone];
                const isSelected = node.id === selectedNodeId;
                const boxWidth = node.zone === 'clinical' ? 148 : 164;
                const boxHeight = 52;

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer group"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedNodeId(node.id);
                      }
                    }}
                  >
                    {isSelected && (
                      <rect
                        x={node.x - boxWidth / 2 - 5}
                        y={node.y - boxHeight / 2 - 5}
                        width={boxWidth + 10}
                        height={boxHeight + 10}
                        rx="15"
                        fill="none"
                        stroke={style.stroke}
                        strokeWidth="2"
                        strokeOpacity="0.65"
                      />
                    )}
                    <rect
                      x={node.x - boxWidth / 2}
                      y={node.y - boxHeight / 2}
                      width={boxWidth}
                      height={boxHeight}
                      rx="12"
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth={isSelected ? 2.4 : 1.4}
                    />
                    <circle
                      cx={node.x - boxWidth / 2 + 16}
                      cy={node.y - 7}
                      r="4.5"
                      fill={node.status === 'Elevated Watch' ? '#F59E0B' : '#10B981'}
                    />
                    <text
                      x={node.x - boxWidth / 2 + 27}
                      y={node.y - 3}
                      className="fill-white text-[11.5px] font-semibold"
                    >
                      {node.shortName}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 15}
                      textAnchor="middle"
                      className="fill-slate-300/80 text-[10px] font-mono"
                    >
                      {node.ipSubnet} • {node.connectedDevices} dev
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Node Inspector Panel */}
        <div className="glass-card rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                  ZONE_STYLE[selectedNode.zone].badge
                }`}
              >
                {ZONE_STYLE[selectedNode.zone].label}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {selectedNode.status}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-2.5 text-cyan-300">
                {selectedNode.zone === 'security' ? (
                  <Shield className="h-6 w-6" />
                ) : selectedNode.zone === 'core' ? (
                  <Database className="h-6 w-6" />
                ) : (
                  <Network className="h-6 w-6" />
                )}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-white">{selectedNode.name}</h3>
                <p className="font-mono text-xs text-cyan-300">{selectedNode.vlan}</p>
              </div>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              {selectedNode.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-slate-800 bg-[#071425] p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Wifi className="h-3.5 w-3.5 text-cyan-400" />
                  <span>IP Subnet</span>
                </div>
                <div className="mt-1 font-mono text-xs font-semibold text-white">
                  {selectedNode.ipSubnet}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-[#071425] p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MonitorCheck className="h-3.5 w-3.5 text-teal-400" />
                  <span>Connected Devices</span>
                </div>
                <div className="mt-1 font-mono text-xs font-semibold text-white">
                  {selectedNode.connectedDevices} Active
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-[#071425] p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Server className="h-3.5 w-3.5 text-sky-400" />
                  <span>OSPF Area</span>
                </div>
                <div className="mt-1 font-mono text-xs font-semibold text-white">
                  {selectedNode.ospfArea}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-[#071425] p-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Cpu className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Avg Latency</span>
                </div>
                <div className="mt-1 font-mono text-xs font-semibold text-emerald-300">
                  {selectedNode.latencyMs} ms
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Active Security Protocols
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {selectedNode.protocols.map((proto) => (
                  <span
                    key={proto}
                    className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-1 font-mono text-[11px] text-cyan-200"
                  >
                    <Lock className="h-3 w-3 text-cyan-400" />
                    {proto}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-teal-500/25 bg-teal-500/10 p-3.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-teal-300">
              Security Enforcement Note
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slate-200">
              {selectedNode.securityNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

