import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { STAGES, SOURCES, LOST_REASONS } from '../../data/initialLeads';
import { formatCurrency } from '../../lib/utils';
import { BrandIcon } from '../common/BrandLogo';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Layers, 
  Target, 
  UserCheck, 
  Award,
  AlertOctagon,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function AnalyticsView() {
  const { leads, stats } = useLeads();

  // Funnel progression
  const funnelStages = ['new', 'contacted', 'qualified', 'proposal_sent', 'won'];
  const maxFunnelCount = Math.max(1, ...funnelStages.map(s => stats.stageSummary[s]?.count || 0));

  // Lost reasons calculation
  const lostLeads = leads.filter(l => l.stage === 'lost');
  const lostReasonCounts = {};
  LOST_REASONS.forEach(r => { lostReasonCounts[r] = 0; });
  lostLeads.forEach(l => {
    const reason = l.lostReason || 'Other / Not Specified';
    lostReasonCounts[reason] = (lostReasonCounts[reason] || 0) + 1;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-100/60 dark:bg-zinc-950 space-y-6">
      {/* Executive LeadFlow Intelligence Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 text-white rounded-2xl p-5 sm:p-6 border border-zinc-800 shadow-lg shadow-emerald-500/5">
        {/* Subtle Background Glow */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <BrandIcon className="w-11 h-11 shrink-0 shadow-md shadow-emerald-500/20" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
                  Lead<span className="text-emerald-400">Flow</span> Intelligence & Funnel Analytics
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  RM Edition
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Real-time telemetry for ad channel attribution (Meta & TikTok Ads), WhatsApp response velocity, and pipeline conversion health.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-zinc-800">
            <div className="text-left lg:text-right">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-zinc-400">Closed Won Revenue</span>
              <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">
                {formatCurrency(stats.wonValue)}
              </div>
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="text-left lg:text-right">
              <span className="text-[11px] uppercase font-semibold tracking-wider text-zinc-400">Win Rate</span>
              <div className="text-lg sm:text-xl font-extrabold text-zinc-100 font-mono">
                {stats.winRate}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Visual Conversion Funnel */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Lead Progression Funnel</span>
            </h3>
            <span className="text-xs text-zinc-400">Top to Bottom Flow</span>
          </div>

          <div className="space-y-3">
            {funnelStages.map((stageId, idx) => {
              const stage = STAGES.find(s => s.id === stageId);
              const data = stats.stageSummary[stageId] || { count: 0, value: 0 };
              const widthPct = Math.max(12, Math.round((data.count / maxFunnelCount) * 100));

              return (
                <div key={stageId} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">
                        {idx + 1}
                      </span>
                      <span>{stage?.label}</span>
                    </span>
                    <span className="font-mono text-zinc-900 dark:text-zinc-100 font-bold">
                      {data.count} leads ({formatCurrency(data.value)})
                    </span>
                  </div>

                  <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden flex items-center">
                    <div
                      className={`h-full rounded-md transition-all duration-500 ${
                        stageId === 'new' ? 'bg-blue-500' :
                        stageId === 'contacted' ? 'bg-amber-500' :
                        stageId === 'qualified' ? 'bg-indigo-500' :
                        stageId === 'proposal_sent' ? 'bg-purple-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Marketing Source Attribution */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-emerald-500" />
              <span>Channel Attribution & Revenue</span>
            </h3>
            <span className="text-xs text-zinc-400">ROI by Source</span>
          </div>

          <div className="space-y-3.5">
            {SOURCES.map(source => {
              const srcData = stats.sourceBreakdown[source] || { count: 0, value: 0, wonCount: 0 };
              const leadShare = Math.round((srcData.count / (leads.length || 1)) * 100);

              return (
                <div key={source} className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {source}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-zinc-500 dark:text-zinc-400">{srcData.count} leads</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {formatCurrency(srcData.value)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${leadShare}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 w-8 text-right">{leadShare}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Lost Reasons Analysis */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4 text-rose-500" />
              <span>Deal Loss Reason Taxonomy</span>
            </h3>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold font-mono">
              {stats.lostCount} Lost Deals
            </span>
          </div>

          <div className="space-y-2.5">
            {Object.entries(lostReasonCounts).map(([reason, count]) => {
              const pct = stats.lostCount > 0 ? Math.round((count / stats.lostCount) * 100) : 0;

              return (
                <div key={reason} className="flex items-center justify-between text-xs p-2 rounded bg-zinc-50 dark:bg-zinc-800/40">
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                    {reason}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{count}</span>
                    <span className="text-zinc-400 text-[11px]">({pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Sales Playbook Checklist */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Sales Playbook & Best Practices</span>
            </h3>

            <div className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-300">
              <div className="flex items-start gap-2 p-2 rounded bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/50">
                <span className="text-emerald-600 font-bold">✓</span>
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">Speed to Lead Protocol (&lt; 15 Mins):</strong>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Contact fresh inbound campaign inquiries via WhatsApp within 15 minutes to maximize conversion probability.</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/50">
                <span className="text-blue-600 font-bold">✓</span>
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">3-to-5 Touch Cadence:</strong>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Never archive a lead without at least 3 scheduled follow-up touchpoints (WhatsApp + Phone + Value Case Study).</p>
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 rounded bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/50">
                <span className="text-purple-600 font-bold">✓</span>
                <div>
                  <strong className="text-zinc-900 dark:text-zinc-100">BANT Qualification:</strong>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Verify budget and executive decision authority before spending time drafting formal proposals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
