import React, { useState } from 'react';
import {
  CheckCircle2,
  FlaskConical,
  Lock,
  Shield,
  Stethoscope,
  UserCog,
  UserPlus,
  XCircle,
} from 'lucide-react';
import { RBAC_ROLES } from '../data/hospitalData';
import type { RbacRoleId } from '../types/security';
import { SectionHeader } from './SectionHeader';

const ROLE_ICONS: Record<RbacRoleId, React.ComponentType<{ className?: string }>> = {
  doctor: Stethoscope,
  nurse: UserPlus,
  admin: UserCog,
  lab_tech: FlaskConical,
};

export const RbacSection: React.FC = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<RbacRoleId>('doctor');

  const activeRole =
    RBAC_ROLES.find((role) => role.id === selectedRoleId) ?? RBAC_ROLES[0];
  const ActiveIcon = ROLE_ICONS[activeRole.id];

  const allowedCount = activeRole.permissions.filter((p) => p.allowed).length;
  const deniedCount = activeRole.permissions.length - allowedCount;

  return (
    <section id="rbac" className="scroll-mt-20 lg:scroll-mt-8">
      <SectionHeader
        badge="Zero-Trust Identity Governance"
        title="Role-Based Access Control (RBAC)"
        subtitle="Select a hospital staff role to inspect which medical and infrastructure resources are ALLOWED or DENIED under strict least-privilege policy."
        simBadge="Interactive Policy Matrix"
      />

      {/* Role Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {RBAC_ROLES.map((role) => {
          const Icon = ROLE_ICONS[role.id];
          const isSelected = role.id === selectedRoleId;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => setSelectedRoleId(role.id)}
              className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-cyan-400 bg-gradient-to-br from-cyan-500/20 to-blue-600/10 shadow-lg shadow-cyan-500/15'
                  : 'glass-card hover:border-cyan-500/35'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`rounded-xl border p-2.5 ${
                    isSelected
                      ? 'border-cyan-400/50 bg-cyan-500/20 text-cyan-300'
                      : 'border-slate-700 bg-slate-900/80 text-slate-400'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  {role.permissions.filter((p) => p.allowed).length}/{role.permissions.length} Allowed
                </span>
              </div>
              <div className="mt-3 font-display text-base font-bold text-white">{role.title}</div>
              <div className="mt-0.5 text-xs text-cyan-300/80">{role.department}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Role Policy Matrix */}
      <div className="mt-6 glass-card rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-start gap-3.5">
            <div className="rounded-xl border border-cyan-500/35 bg-cyan-500/15 p-3 text-cyan-300">
              <ActiveIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-xl font-bold text-white">
                  {activeRole.title} Access Profile
                </h3>
                <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-300">
                  {activeRole.clearanceLevel}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-300 max-w-2xl">
                {activeRole.summary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-center">
              <div className="font-display text-lg font-bold text-emerald-300">{allowedCount}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-200/80">
                Allowed
              </div>
            </div>
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-center">
              <div className="font-display text-lg font-bold text-rose-300">{deniedCount}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-200/80">
                Denied
              </div>
            </div>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {activeRole.permissions.map((perm) => (
            <div
              key={perm.resourceId}
              className={`rounded-xl border p-4 transition-colors ${
                perm.allowed
                  ? 'border-emerald-500/25 bg-emerald-950/20'
                  : 'border-rose-500/25 bg-rose-950/15'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {perm.category} • {perm.sensitivity}
                  </span>
                  <h4 className="mt-0.5 text-sm font-bold text-white">{perm.resourceName}</h4>
                </div>

                {perm.allowed ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-300 shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    ALLOWED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-400/40 bg-rose-500/20 px-2.5 py-1 text-[11px] font-bold text-rose-300 shrink-0">
                    <XCircle className="h-3.5 w-3.5" />
                    DENIED
                  </span>
                )}
              </div>

              <div className="mt-2.5 flex items-center justify-between text-xs border-t border-white/5 pt-2.5">
                <span className="text-slate-300 leading-relaxed">{perm.rationale}</span>
              </div>

              <div className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-cyan-300/90">
                {perm.allowed ? (
                  <Shield className="h-3 w-3 text-emerald-400" />
                ) : (
                  <Lock className="h-3 w-3 text-rose-400" />
                )}
                <span>Policy Scope: {perm.accessLevel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

