import React from 'react';
import { ArrowRight, Cpu, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { MedGuardLogo } from './MedGuardLogo';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

const HERO_NODES = [
  { x: 110, y: 95, label: 'Emergency' },
  { x: 250, y: 65, label: 'ICU' },
  { x: 420, y: 120, label: 'Firewall' },
  { x: 590, y: 70, label: 'Radiology' },
  { x: 740, y: 110, label: 'Pharmacy' },
  { x: 165, y: 245, label: 'Lab' },
  { x: 420, y: 245, label: 'MEDGUARD CORE' },
  { x: 685, y: 245, label: 'Central DB' },
  { x: 280, y: 360, label: 'Records' },
  { x: 560, y: 360, label: 'IDS Monitor' },
];

const HERO_EDGES: Array<[number, number]> = [
  [0, 2],
  [1, 2],
  [2, 6],
  [3, 2],
  [4, 3],
  [4, 7],
  [5, 6],
  [6, 7],
  [6, 8],
  [6, 9],
  [8, 9],
  [9, 7],
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#0B1B33] via-[#07111F] to-[#081A2E] p-6 sm:p-10 lg:p-12 shadow-2xl"
    >
      {/* Animated Hospital Network Background SVG */}
      <div className="pointer-events-none absolute inset-0 opacity-45">
        <svg viewBox="0 0 850 420" className="h-full w-full object-cover" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="heroGlow" cx="50%" cy="55%" r="55%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#07111F" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="850" height="420" fill="url(#heroGlow)" />

          {HERO_EDGES.map(([a, b], idx) => {
            const n1 = HERO_NODES[a];
            const n2 = HERO_NODES[b];
            return (
              <g key={idx}>
                <line
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke="#0EA5E9"
                  strokeOpacity="0.22"
                  strokeWidth="1.5"
                />
                <line
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke="#22D3EE"
                  strokeOpacity="0.65"
                  strokeWidth="1.8"
                  className="animate-flow-dash"
                />
              </g>
            );
          })}

          {HERO_NODES.map((node, i) => (
            <g key={i}>
              <circle
                cx={node.x}
                cy={node.y}
                r={i === 6 ? 16 : 9}
                fill="#0B1F3A"
                stroke={i === 6 ? '#2DD4BF' : '#38BDF8'}
                strokeWidth={i === 6 ? 2.5 : 1.6}
                className="animate-pulse-ring"
              />
              <circle cx={node.x} cy={node.y} r={i === 6 ? 6 : 3.5} fill="#22D3EE" />
              <text
                x={node.x}
                y={node.y + (i === 6 ? 28 : 20)}
                textAnchor="middle"
                className="fill-cyan-200/70 text-[10px] font-mono"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-medium text-cyan-200 backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>CNIP Final-Year Project • Enterprise Hospital Cybersecurity SOC</span>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <MedGuardLogo size={62} className="shrink-0 drop-shadow-[0_0_20px_rgba(34,211,238,0.35)]" />
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-teal-300">
              MEDGUARD AI
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              MEDGUARD AI{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-teal-300 bg-clip-text text-transparent">
                Intelligent Secure Hospital Network
              </span>
            </h1>
          </div>
        </div>

        <p className="mt-5 text-base sm:text-lg font-medium text-cyan-100/90 max-w-2xl">
          &ldquo;Protecting Patient Data. Securing Hospital Networks. Enabling Smarter Healthcare.&rdquo;
        </p>

        <p className="mt-3 text-sm leading-relaxed text-slate-300 max-w-2xl">
          Unified Security Operations Center integrating real browser Web Crypto{' '}
          <span className="text-cyan-300 font-medium">AES-256-GCM</span>,{' '}
          <span className="text-cyan-300 font-medium">RSA-2048</span>, and{' '}
          <span className="text-cyan-300 font-medium">SHA-256</span> cryptography with{' '}
          <span className="text-teal-300 font-medium">Dijkstra Shortest-Path Routing</span>,{' '}
          <span className="text-teal-300 font-medium">OSPF Area Resilience</span>,{' '}
          <span className="text-sky-300 font-medium">Intrusion Detection</span>, and{' '}
          <span className="text-sky-300 font-medium">Role-Based Access Control</span>.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3.5">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition-all hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-400/35 cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4" />
            Explore Dashboard
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('algorithms')}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/35 bg-slate-900/75 px-5 py-3 text-sm font-semibold text-cyan-200 backdrop-blur-md transition-all hover:border-cyan-300 hover:bg-cyan-500/15 cursor-pointer"
          >
            <Cpu className="h-4 w-4 text-cyan-400" />
            Explore Security Algorithms
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Encryption Standard', value: 'AES-256-GCM' },
            { label: 'Integrity Ledger', value: 'SHA-256 Live' },
            { label: 'Routing Engine', value: 'Dijkstra + OSPF' },
            { label: 'Access Governance', value: 'Zero-Trust RBAC' },
          ].map((pill) => (
            <div
              key={pill.label}
              className="rounded-xl border border-cyan-500/15 bg-[#071425]/80 px-3.5 py-2.5 backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Lock className="h-3 w-3 text-cyan-400" />
                <span>{pill.label}</span>
              </div>
              <div className="mt-0.5 font-mono text-xs sm:text-sm font-semibold text-cyan-200">
                {pill.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

