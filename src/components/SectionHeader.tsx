import React from 'react';

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
  simBadge?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  simBadge,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          {badge}
        </div>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm text-slate-400 max-w-2xl">{subtitle}</p>
      </div>

      {simBadge && (
        <div className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-200 shrink-0">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          {simBadge}
        </div>
      )}
    </div>
  );
};

