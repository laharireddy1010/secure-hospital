import React, { useState } from 'react';
import {
  Activity,
  BookOpen,
  Cpu,
  FileSearch,
  KeyRound,
  Layers,
  Lock,
  Menu,
  Network,
  Route,
  ShieldAlert,
  UserCheck,
  X,
} from 'lucide-react';
import { MedGuardLogo } from './MedGuardLogo';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Home / Dashboard', icon: Activity },
  { id: 'topology', label: 'Hospital Network Topology', icon: Network },
  { id: 'algorithms', label: 'Security Algorithms', icon: Cpu },
  { id: 'encryption-lab', label: 'Encryption Laboratory', icon: Lock },
  { id: 'intrusion-detection', label: 'Intrusion Detection', icon: ShieldAlert },
  { id: 'secure-routing', label: 'Secure Routing', icon: Route },
  { id: 'rbac', label: 'Role-Based Access Control', icon: UserCheck },
  { id: 'security-logs', label: 'Security Logs', icon: FileSearch },
  { id: 'architecture', label: 'System Architecture', icon: Layers },
  { id: 'about', label: 'About Project', icon: BookOpen },
];

interface SidebarNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeSection, onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (id: string) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <>
      {/* Mobile / Tablet Sticky Top Bar */}
      <header className="lg:hidden sticky top-0 z-50 border-b border-cyan-500/20 bg-[#07111F]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => handleClick('hero')}
            className="flex items-center gap-2.5 text-left"
          >
            <MedGuardLogo size={34} />
            <div>
              <div className="font-display text-base font-bold tracking-tight text-white">
                MEDGUARD <span className="text-cyan-400">AI</span>
              </div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-teal-300/80">
                Hospital SOC Platform
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SOC Active
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="rounded-lg border border-cyan-500/25 bg-slate-900/80 p-2 text-cyan-300 hover:bg-cyan-500/10"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <nav className="border-t border-cyan-500/15 bg-[#081526]/98 px-3 py-3 max-h-[75vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleClick(item.id)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/35 shadow-sm shadow-cyan-500/10'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:shrink-0 lg:flex-col lg:sticky lg:top-0 lg:h-screen border-r border-cyan-500/15 bg-[#060F1C]/95 backdrop-blur-xl z-40">
        <div className="p-5 border-b border-cyan-500/15">
          <button
            type="button"
            onClick={() => handleClick('hero')}
            className="flex items-center gap-3 text-left group w-full"
          >
            <MedGuardLogo size={42} className="transition-transform duration-300 group-hover:scale-105" />
            <div>
              <div className="font-display text-lg font-bold tracking-tight text-white">
                MEDGUARD <span className="text-cyan-400">AI</span>
              </div>
              <div className="text-[11px] font-medium text-teal-300/80 tracking-wide">
                Intelligent Secure Hospital
              </div>
            </div>
          </button>

          <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-300">Network Health: 98%</span>
            </div>
            <KeyRound className="h-3.5 w-3.5 text-emerald-400/80" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            SOC Navigation Modules
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-400/35 shadow-lg shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cyan-500/15 bg-[#050C17]/80">
          <div className="rounded-xl border border-cyan-500/15 bg-slate-900/60 p-3">
            <div className="text-[11px] font-semibold text-cyan-300">CNIP Academic Project</div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
              Single-page live demonstration combining AES-256, RSA, SHA-256, Dijkstra, OSPF, IDS & RBAC.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

