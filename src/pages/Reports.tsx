import React, { useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import { STAGES } from '../data/initialLeads';
import { formatCurrency } from '../lib/utils';
import LeadListReport from '../components/reports/LeadListReport';
import { Users, Target, Trophy, TrendingUp, PieChart, BarChart3 } from 'lucide-react';

interface MonthBucket {
  key: string;
  label: string;
  won: number;
  lost: number;
  pipeline: number;
}

export default function Reports() {
  const { leads, stats } = useLeads();

  const leadsBySource = useMemo(() => {
    const counts = new Map<string, { count: number; value: number }>();
    leads.forEach((l) => {
      const entry = counts.get(l.source) || { count: 0, value: 0 };
      entry.count += 1;
      entry.value += Number(l.dealValue) || 0;
      counts.set(l.source, entry);
    });
    return Array.from(counts.entries())
      .map(([source, { count, value }]) => ({ source, count, value }))
      .sort((a, b) => b.count - a.count);
  }, [leads]);

  const leadsByStage = useMemo(
    () =>
      STAGES.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage.id);
        return {
          stage,
          count: stageLeads.length,
          value: stageLeads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0),
        };
      }),
    [leads]
  );

  const revenueByMonth = useMemo<MonthBucket[]>(() => {
    const buckets = new Map<string, MonthBucket>();
    const now = new Date();
    // Last 6 months, oldest first
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      buckets.set(key, {
        key,
        label: d.toLocaleDateString('en-MY', { month: 'short', year: '2-digit' }),
        won: 0,
        lost: 0,
        pipeline: 0,
      });
    }
    leads.forEach((l) => {
      const created = new Date(l.createdAt);
      if (isNaN(created.getTime())) return;
      const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`;
      const bucket = buckets.get(key);
      if (!bucket) return;
      const value = Number(l.dealValue) || 0;
      if (l.stage === 'won') bucket.won += value;
      else if (l.stage === 'lost') bucket.lost += value;
      else bucket.pipeline += value;
    });
    return Array.from(buckets.values());
  }, [leads]);

  const conversionRate = stats.winRate;
  const wonLeads = leads.filter((l) => l.stage === 'won').length;
  const lostLeads = leads.filter((l) => l.stage === 'lost').length;
  const maxSourceCount = Math.max(1, ...leadsBySource.map((s) => s.count));
  const maxMonthValue = Math.max(1, ...revenueByMonth.map((m) => m.won + m.pipeline + m.lost));

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-100/60 dark:bg-zinc-950 space-y-6">
      {/* Summary header */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">Reports & Summary Dashboard</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              <Users className="w-3.5 h-3.5" /> Total Leads
            </div>
            <div className="mt-1.5 text-xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">{stats.totalLeads}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">{wonLeads} won · {lostLeads} lost</div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              <Target className="w-3.5 h-3.5" /> Conversion Rate
            </div>
            <div className="mt-1.5 text-xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">{conversionRate}%</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">won ÷ closed deals</div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              <Trophy className="w-3.5 h-3.5" /> Won Revenue
            </div>
            <div className="mt-1.5 text-xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">{formatCurrency(stats.wonRevenue)}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">closed-won total</div>
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              <TrendingUp className="w-3.5 h-3.5" /> Active Pipeline
            </div>
            <div className="mt-1.5 text-xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">{formatCurrency(stats.activePipelineValue)}</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">open deals value</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Source */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Leads by Source
            </h3>
            <span className="text-[11px] text-zinc-400">{leadsBySource.length} sources</span>
          </div>
          <div className="space-y-3">
            {leadsBySource.map((s) => (
              <div key={s.source}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{s.source}</span>
                  <span className="font-mono text-zinc-500 dark:text-zinc-400">{s.count} · {formatCurrency(s.value)}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 dark:bg-blue-400"
                    style={{ width: `${(s.count / maxSourceCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {leadsBySource.length === 0 && <p className="text-xs text-zinc-400">No leads yet.</p>}
          </div>
        </div>

        {/* Leads by Stage (revenue by stage) */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Leads & Revenue by Stage
            </h3>
          </div>
          <div className="space-y-3">
            {leadsByStage.map(({ stage, count, value }) => (
              <div key={stage.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{stage.label}</span>
                  <span className="font-mono text-zinc-500 dark:text-zinc-400">{count} · {formatCurrency(value)}</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stage.bgLight} dark:${'bg'} ${stage.bgDark}`}
                    style={{ width: `${stats.totalLeads ? (count / stats.totalLeads) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue by Month */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-4">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Revenue by Month (Last 6 Months)
        </h3>
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-40">
          {revenueByMonth.map((m) => {
            const total = m.won + m.pipeline + m.lost;
            const wonH = (m.won / maxMonthValue) * 100;
            const pipelineH = (m.pipeline / maxMonthValue) * 100;
            const lostH = (m.lost / maxMonthValue) * 100;
            return (
              <div key={m.key} className="flex-1 flex flex-col items-center gap-1.5 h-full">
                <div className="flex-1 w-full flex flex-col justify-end gap-0.5">
                  <div className="w-full rounded-t bg-rose-300 dark:bg-rose-700/60" style={{ height: `${lostH}%` }} title={`Lost: ${formatCurrency(m.lost)}`} />
                  <div className="w-full bg-amber-300 dark:bg-amber-700/60" style={{ height: `${pipelineH}%` }} title={`Pipeline: ${formatCurrency(m.pipeline)}`} />
                  <div className="w-full rounded-b bg-emerald-500 dark:bg-emerald-400/80" style={{ height: `${wonH}%` }} title={`Won: ${formatCurrency(m.won)}`} />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">{m.label}</span>
                <span className="text-[9px] font-mono text-zinc-400 hidden sm:block">{total > 0 ? formatCurrency(total) : '—'}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 dark:bg-emerald-400/80" /> Won</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-300 dark:bg-amber-700/60" /> Pipeline</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-rose-300 dark:bg-rose-700/60" /> Lost</span>
        </div>
      </div>

      {/* Filterable lead list with export */}
      <LeadListReport />
    </div>
  );
}
