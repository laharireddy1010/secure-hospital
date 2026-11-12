import React, { useMemo, useState } from 'react';
import { FileSearch, Filter, PlusCircle, Search } from 'lucide-react';
import { INITIAL_SECURITY_LOGS, SIMULATED_LOG_TEMPLATES } from '../data/hospitalData';
import type { SecurityLogEntry, ThreatSeverity } from '../types/security';
import { SectionHeader } from './SectionHeader';

const SEVERITY_STYLE: Record<ThreatSeverity, string> = {
  LOW: 'border-cyan-500/35 bg-cyan-500/15 text-cyan-300',
  MEDIUM: 'border-amber-500/35 bg-amber-500/15 text-amber-300',
  HIGH: 'border-orange-500/40 bg-orange-500/15 text-orange-300',
  CRITICAL: 'border-rose-500/45 bg-rose-500/20 text-rose-300',
};

const STATUS_STYLE: Record<SecurityLogEntry['status'], string> = {
  Blocked: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
  Mitigated: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  Verified: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  Allowed: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
};

export const SecurityLogsSection: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLogEntry[]>(INITIAL_SECURITY_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | ThreatSeverity>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [templateIndex, setTemplateIndex] = useState(0);

  const departments = useMemo(() => {
    const unique = Array.from(new Set(logs.map((l) => l.department)));
    return ['ALL', ...unique];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return logs.filter((entry) => {
      const matchesSeverity = severityFilter === 'ALL' || entry.severity === severityFilter;
      const matchesDept = departmentFilter === 'ALL' || entry.department === departmentFilter;
      const matchesQuery =
        !q ||
        entry.department.toLowerCase().includes(q) ||
        entry.eventType.toLowerCase().includes(q) ||
        entry.actionTaken.toLowerCase().includes(q) ||
        entry.timestamp.toLowerCase().includes(q) ||
        entry.sourceIp.toLowerCase().includes(q);
      return matchesSeverity && matchesDept && matchesQuery;
    });
  }, [logs, searchQuery, severityFilter, departmentFilter]);

  const handleGenerateEvent = () => {
    const template = SIMULATED_LOG_TEMPLATES[templateIndex % SIMULATED_LOG_TEMPLATES.length];
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newEntry: SecurityLogEntry = {
      id: `LOG-${408 + logs.length}`,
      timestamp,
      ...template,
    };

    setLogs((prev) => [newEntry, ...prev]);
    setTemplateIndex((prev) => prev + 1);
  };

  return (
    <section id="security-logs" className="scroll-mt-20 lg:scroll-mt-8">
      <SectionHeader
        badge="SIEM Audit Ledger"
        title="Security Logs"
        subtitle="Searchable and filterable hospital security event stream tracking firewall blocks, cryptographic verifications, and simulated threat events."
        simBadge="Simulated Audit Events"
      />

      <div className="glass-card rounded-2xl p-5">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search department, event, IP, or action..."
                className="w-full rounded-xl border border-slate-700 bg-[#050E1B] pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as 'ALL' | ThreatSeverity)}
                className="rounded-xl border border-slate-700 bg-[#050E1B] px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-[#050E1B] px-3 py-2 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'ALL' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerateEvent}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 cursor-pointer shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            Generate Simulated Event
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#050E1B]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Threat Severity</th>
                <th className="px-4 py-3">Action Taken</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    <FileSearch className="h-5 w-5 mx-auto mb-2 text-slate-500" />
                    No security logs match your current search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/35 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="px-4 py-3 font-semibold text-cyan-200 whitespace-nowrap">
                      {log.department}
                      <div className="font-mono text-[10px] font-normal text-slate-500">
                        {log.sourceIp}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-100 font-medium">{log.eventType}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                          SEVERITY_STYLE[log.severity]
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{log.actionTaken}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                          STATUS_STYLE[log.status]
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
          <span>
            Showing {filteredLogs.length} of {logs.length} simulated audit entries
          </span>
          <span className="font-mono text-cyan-300/80">SIEM LOG INTEGRITY: VERIFIED</span>
        </div>
      </div>
    </section>
  );
};

