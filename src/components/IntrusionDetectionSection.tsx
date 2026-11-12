import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Radar,
  ShieldAlert,
  ShieldBan,
  ShieldCheck,
  UserX,
} from 'lucide-react';
import { PREDEFINED_IDS_EVENTS } from '../data/hospitalData';
import type { IdsEvent, ThreatSeverity } from '../types/security';
import { SectionHeader } from './SectionHeader';

const SEVERITY_BADGES: Record<ThreatSeverity, string> = {
  LOW: 'border-cyan-500/35 bg-cyan-500/15 text-cyan-300',
  MEDIUM: 'border-amber-500/35 bg-amber-500/15 text-amber-300',
  HIGH: 'border-orange-500/40 bg-orange-500/15 text-orange-300',
  CRITICAL: 'border-rose-500/45 bg-rose-500/20 text-rose-300',
};

const TRAFFIC_CATEGORIES = [
  {
    label: 'Normal Traffic',
    value: '1,420 pkts/s',
    sub: 'Verified TLS 1.3 + AES-256',
    icon: Activity,
    tone: 'text-emerald-300 border-emerald-500/25 bg-emerald-500/10',
  },
  {
    label: 'Suspicious Traffic',
    value: '18 flows',
    sub: 'Flagged for deep inspection',
    icon: AlertOctagon,
    tone: 'text-amber-300 border-amber-500/25 bg-amber-500/10',
  },
  {
    label: 'Unauthorized Logins',
    value: '47 probes',
    sub: 'Admin & EHR credential sweeps',
    icon: UserX,
    tone: 'text-rose-300 border-rose-500/25 bg-rose-500/10',
  },
  {
    label: 'Suspicious Packets',
    value: '31 payloads',
    sub: 'Port sweeps & SQLi patterns',
    icon: ShieldAlert,
    tone: 'text-orange-300 border-orange-500/25 bg-orange-500/10',
  },
  {
    label: 'Blocked Connections',
    value: '9 hosts',
    sub: 'Auto-dropped at Firewall',
    icon: ShieldBan,
    tone: 'text-cyan-300 border-cyan-500/25 bg-cyan-500/10',
  },
];

interface IntrusionDetectionSectionProps {
  externalScanSignal?: number;
}

export const IntrusionDetectionSection: React.FC<IntrusionDetectionSectionProps> = ({
  externalScanSignal = 0,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanCompleted, setScanCompleted] = useState(true);
  const [scanResults, setScanResults] = useState<IdsEvent[]>(PREDEFINED_IDS_EVENTS);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | ThreatSeverity>('ALL');

  const runScan = () => {
    if (scanning) return;
    setScanning(true);
    setScanCompleted(false);
    setScanProgress(10);

    const steps = [35, 65, 88, 100];
    steps.forEach((pct, idx) => {
      window.setTimeout(() => {
        setScanProgress(pct);
        if (pct === 100) {
          setScanning(false);
          setScanCompleted(true);
          setScanResults([...PREDEFINED_IDS_EVENTS]);
        }
      }, (idx + 1) * 260);
    });
  };

  React.useEffect(() => {
    if (externalScanSignal > 0) {
      runScan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalScanSignal]);

  const filteredEvents =
    severityFilter === 'ALL'
      ? scanResults
      : scanResults.filter((evt) => evt.severity === severityFilter);

  const threatCount = scanResults.filter((e) => e.isThreat).length;

  return (
    <section id="intrusion-detection" className="scroll-mt-20 lg:scroll-mt-8">
      <SectionHeader
        badge="Simulated IDS Engine"
        title="Intrusion Detection System"
        subtitle="Simulated network monitoring system inspecting hospital department packet streams for unauthorized logins, port scanning, and malformed payloads."
        simBadge="Simulated Network Monitoring"
      />

      {/* Live / Simulated Traffic Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {TRAFFIC_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.label} className="glass-card rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{cat.label}</span>
                <div className={`rounded-lg border p-1.5 ${cat.tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 font-display text-xl font-bold text-white">{cat.value}</div>
              <div className="mt-1 text-[11px] text-slate-400">{cat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Scan Control Bar */}
      <div className="mt-6 glass-card rounded-2xl p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-cyan-300">
              <Radar className={`h-6 w-6 ${scanning ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Deep Packet &amp; Anomaly Security Scanner
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Analyzes predefined simulated hospital packet events and assigns LOW, MEDIUM, HIGH,
                or CRITICAL threat classifications.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-[#050E1B] p-1">
              {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => setSeverityFilter(sev)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={runScan}
              disabled={scanning}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-60 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              {scanning ? 'Scanning Hospital VLANs...' : 'RUN SECURITY SCAN'}
            </button>
          </div>
        </div>

        {/* Scan Progress Bar */}
        {scanning && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-cyan-300 mb-1.5 font-mono">
              <span>Inspecting Emergency, ICU, Lab, Pharmacy, Radiology &amp; Admin traffic...</span>
              <span>{scanProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-200"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Scan Summary Strip */}
        {scanCompleted && !scanning && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                Simulated Scan Complete: Inspected {scanResults.length} sample packet streams •{' '}
                {threatCount} threats identified &amp; contained • {scanResults.length - threatCount}{' '}
                verified normal traffic.
              </span>
            </div>
            <span className="font-mono text-[11px] text-emerald-200/80">
              STATUS: NETWORK PROTECTED
            </span>
          </div>
        )}

        {/* Threat Analysis Cards */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="rounded-xl border border-slate-800 bg-[#061222]/90 p-4 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider ${
                      SEVERITY_BADGES[evt.severity]
                    }`}
                  >
                    {evt.severity}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {evt.id} • {evt.timestamp}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    evt.scanResult === 'Allowed'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  Scan Result: {evt.scanResult}
                </span>
              </div>

              <h4 className="mt-2.5 text-sm font-bold text-white">{evt.eventTitle}</h4>

              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-900/80 px-2.5 py-1.5">
                  <span className="text-slate-400">Threat Category: </span>
                  <span className="font-semibold text-cyan-300">{evt.category}</span>
                </div>
                <div className="rounded-lg bg-slate-900/80 px-2.5 py-1.5">
                  <span className="text-slate-400">Target: </span>
                  <span className="font-semibold text-slate-200">{evt.targetDepartment}</span>
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                <span className="font-mono text-slate-300">{evt.sourceIp}</span> — {evt.packetSummary}
              </p>

              <div className="mt-3 rounded-lg border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-xs text-teal-200">
                <span className="font-semibold text-teal-300">Recommended Action: </span>
                {evt.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

