import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { formatCurrency } from '../../lib/utils';
import { TrendingUp, CalendarClock } from 'lucide-react';

export default function MetricsBar() {
  const { stats } = useLeads();

  return (
    <div className="bg-white dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* KPI 1: Active Pipeline */}
        <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span className="font-medium">Active Pipeline</span>
            <span className="text-zinc-400 font-bold text-[10px]">RM</span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              {formatCurrency(stats.activePipelineValue)}
            </span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              {stats.totalLeads} leads
            </span>
          </div>
        </div>

        {/* KPI 2: Won Value & Win Rate */}
        <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span className="font-medium">Closed Won</span>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold gap-0.5">
              <span>{stats.winRate}% win rate</span>
            </div>
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-emerald-700 dark:text-emerald-400 font-mono">
              {formatCurrency(stats.wonRevenue)}
            </span>
          </div>
        </div>

        {/* KPI 3: Follow-ups Due */}
        <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span className="font-medium">Follow-Up Action</span>
            <CalendarClock className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              {stats.followUpsDueCount}
            </span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              due / pending
            </span>
          </div>
        </div>

        {/* KPI 4: Speed to Lead Health */}
        <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span className="font-medium">Speed to Lead</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              &lt; 15 min
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Optimal
            </span>
          </div>
        </div>

        {/* KPI 5: Total Volume */}
        <div className="hidden lg:flex p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60 flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span className="font-medium">Average Deal Size</span>
            <TrendingUp className="w-3.5 h-3.5 text-zinc-400" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
              {formatCurrency(stats.avgDealSize)}
            </span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              avg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
