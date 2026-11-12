import React from 'react';
import {
  ArrowDown,
  Building2,
  Database,
  Flame,
  LockKeyhole,
  Network,
  Route,
  ShieldAlert,
} from 'lucide-react';
import { SYSTEM_ARCHITECTURE_LAYERS } from '../data/hospitalData';
import { SectionHeader } from './SectionHeader';

const LAYER_ICONS = [
  Building2,
  Network,
  Flame,
  Route,
  ShieldAlert,
  LockKeyhole,
  Database,
];

const ACCENT_BORDER: Record<string, string> = {
  cyan: 'border-cyan-500/35 text-cyan-300 bg-cyan-500/10',
  sky: 'border-sky-500/35 text-sky-300 bg-sky-500/10',
  blue: 'border-blue-500/35 text-blue-300 bg-blue-500/10',
  teal: 'border-teal-500/35 text-teal-300 bg-teal-500/10',
  amber: 'border-amber-500/35 text-amber-300 bg-amber-500/10',
  indigo: 'border-indigo-500/35 text-indigo-300 bg-indigo-500/10',
  emerald: 'border-emerald-500/35 text-emerald-300 bg-emerald-500/10',
};

export const ArchitectureSection: React.FC = () => {
  return (
    <section id="architecture" className="scroll-mt-20 lg:scroll-mt-8">
      <SectionHeader
        badge="Defense-in-Depth Blueprint"
        title="System Architecture"
        subtitle="End-to-end packet journey from hospital department terminals down to the encrypted central patient database, explained layer by layer."
      />

      <div className="glass-card rounded-2xl p-5 sm:p-7">
        <div className="max-w-4xl mx-auto">
          {SYSTEM_ARCHITECTURE_LAYERS.map((layer, index) => {
            const Icon = LAYER_ICONS[index] || Network;
            const iconStyle = ACCENT_BORDER[layer.accentColor] || ACCENT_BORDER.cyan;

            return (
              <React.Fragment key={layer.layerNumber}>
                <div className="rounded-2xl border border-slate-800 bg-[#061222]/90 p-4 sm:p-5 hover:border-cyan-500/35 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-xl border p-3 shrink-0 ${iconStyle}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-cyan-400">
                            LAYER 0{layer.layerNumber}
                          </span>
                          <h3 className="font-display text-lg font-bold text-white">
                            {layer.title}
                          </h3>
                        </div>
                        <p className="text-xs font-medium text-teal-300/90">{layer.subtitle}</p>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-300">
                          {layer.explanation}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap md:justify-end gap-1.5 shrink-0 md:max-w-[230px]">
                      {layer.protocols.map((proto) => (
                        <span
                          key={proto}
                          className="rounded-lg border border-slate-700/80 bg-slate-900/90 px-2.5 py-1 font-mono text-[10px] font-medium text-cyan-200"
                        >
                          {proto}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {index < SYSTEM_ARCHITECTURE_LAYERS.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3 py-1 text-[10px] font-mono text-cyan-300">
                      <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
                      <span>Inspected &amp; Encrypted Flow</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

