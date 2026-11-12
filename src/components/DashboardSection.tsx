import React from 'react';
import {
  Activity,
  AlertTriangle,
  Database,
  HeartPulse,
  Laptop,
  Link2,
  ShieldBan,
  ShieldCheck,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  DASHBOARD_TRAFFIC_DATA,
  DEPARTMENT_NETWORK_STATUS,
  RECENT_DASHBOARD_ALERTS,
  SECURITY_ACTIVITY_DATA,
} from '../data/hospitalData';
import { SectionHeader } from './SectionHeader';

const KPI_CARDS = [
  {
    label: 'Connected Devices',
    value: '128',
    note: 'Medical IoT & Staff Terminals',
    icon: Laptop,
    color: 'text-cyan-400',
    border: 'border-cyan-500/25',
    bg: 'bg-cyan-500/10',
  },
  {
    label: 'Protected Patient Records',
    value: '2,450',
    note: 'AES-256 + SHA-256 Verified',
    icon: Database,
    color: 'text-teal-400',
    border: 'border-teal-500/25',
    bg: 'bg-teal-500/10',
  },
  {
    label: 'Active Connections',
    value: '86',
    note: 'Encrypted TLS 1.3 Sessions',
    icon: Link2,
    color: 'text-sky-400',
    border: 'border-sky-500/25',
    bg: 'bg-sky-500/10',
  },
  {
    label: 'Threats Detected',
    value: '12',
    note: 'Flagged by SOC IDS Engine',
    icon: AlertTriangle,
    color: 'text-amber-400',
    border: 'border-amber-500/25',
    bg: 'bg-amber-500/10',
  },
  {
    label: 'Blocked Connections',
    value: '9',
    note: 'Auto-Quarantined by Firewall',
    icon: ShieldBan,
    color: 'text-rose-400',
    border: 'border-rose-500/25',
    bg: 'bg-rose-500/10',
  },
  {
    label: 'Network Health',
    value: '98%',
    note: 'Optimal OSPF Backbone SLA',
    icon: HeartPulse,
    color: 'text-emerald-400',
    border: 'border-emerald-500/25',
    bg: 'bg-emerald-500/10',
  },
];

export const DashboardSection: React.FC = () => {
  return (
    <section id="dashboard" className="scroll-mt-20 lg:scroll-mt-8">
      <SectionHeader
        badge="SOC Command Center"
        title="Main Security Dashboard"
        subtitle="Real-time operational overview of hospital device telemetry, encrypted traffic throughput, department availability, and intrusion defense."
        simBadge="Simulated Demonstration Data"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card glass-card-hover rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {card.label}
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{card.value}</p>
                </div>
                <div className={`rounded-xl border p-2.5 ${card.border} ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
                <span>{card.note}</span>
                <span className="font-mono text-[10px] text-cyan-300/80">SIMULATED</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Network Traffic Line/Area Graph */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base font-semibold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                Hospital Network Traffic (Mbps)
              </h3>
              <p className="text-xs text-slate-400">
                Encrypted AES-256 clinical traffic vs. total inspected firewall throughput (simulated)
              </p>
            </div>
            <span className="rounded-md border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
              24H SIMULATED
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DASHBOARD_TRAFFIC_DATA} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="inspectedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="encryptedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#091526',
                    borderColor: 'rgba(34,211,238,0.35)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="inspectedMbps"
                  name="Inspected Traffic (Mbps)"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#inspectedGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="encryptedMbps"
                  name="Encrypted AES-256 (Mbps)"
                  stroke="#2DD4BF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#encryptedGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security Activity Bar Chart */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-base font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-400" />
                Security Activity & Threat Mitigation
              </h3>
              <p className="text-xs text-slate-400">
                SHA-256 integrity checks, blocked threats, and RBAC access denials (simulated)
              </p>
            </div>
            <span className="rounded-md border border-teal-500/25 bg-teal-500/10 px-2 py-0.5 font-mono text-[10px] text-teal-300">
              SOC TELEMETRY
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SECURITY_ACTIVITY_DATA} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="window" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#091526',
                    borderColor: 'rgba(45,212,191,0.35)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  dataKey="integrityVerified"
                  name="SHA-256 Verified"
                  fill="#06B6D4"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="authDenied"
                  name="RBAC Denials"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="threatsBlocked"
                  name="Threats Blocked"
                  fill="#F43F5E"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Department Status + Recent Security Alerts */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Department-Wise Network Status */}
        <div className="xl:col-span-2 glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-white">
              Department-Wise Network Status
            </h3>
            <span className="text-xs text-slate-400">6 Segmented Hospital VLANs (Simulated)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEPARTMENT_NETWORK_STATUS.map((dept) => (
              <div
                key={dept.name}
                className="rounded-xl border border-slate-800 bg-[#071425]/80 p-3.5 hover:border-cyan-500/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">{dept.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      dept.status === 'Operational'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {dept.status}
                  </span>
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-500">Devices</div>
                    <div className="font-mono font-medium text-slate-200">{dept.devices}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Latency</div>
                    <div className="font-mono font-medium text-cyan-300">{dept.latency}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">Health</div>
                    <div className="font-mono font-medium text-emerald-300">{dept.health}%</div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] font-mono text-teal-300/80">
                  Security: {dept.encryption}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Security Alerts */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-semibold text-white">
              Recent Security Alerts
            </h3>
            <span className="text-[11px] font-mono text-amber-300">SIMULATED FEED</span>
          </div>
          <div className="space-y-3">
            {RECENT_DASHBOARD_ALERTS.map((alert) => {
              const badgeStyle =
                alert.severity === 'HIGH'
                  ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                  : alert.severity === 'MEDIUM'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';

              return (
                <div
                  key={alert.id}
                  className="rounded-xl border border-slate-800 bg-[#071425]/80 p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${badgeStyle}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[11px] text-slate-500">{alert.time}</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">{alert.title}</div>
                  <div className="mt-0.5 text-xs font-medium text-cyan-300/90">{alert.department}</div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{alert.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

