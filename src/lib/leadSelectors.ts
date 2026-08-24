import { Lead, SortOption, Stats } from '../types';

export function filterAndSortLeads(
  leads: Lead[],
  opts: { searchQuery: string; selectedSource: string; selectedPriority: string; sortBy: SortOption }
): Lead[] {
  const { searchQuery, selectedSource, selectedPriority, sortBy } = opts;

  return leads
    .filter((lead) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = lead.name?.toLowerCase().includes(q);
        const matchesCompany = lead.company?.toLowerCase().includes(q);
        const matchesPhone = lead.phone?.toLowerCase().includes(q);
        const matchesNotes = lead.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesCompany && !matchesPhone && !matchesNotes) {
          return false;
        }
      }

      if (selectedSource !== 'all' && lead.source !== selectedSource) {
        return false;
      }

      if (selectedPriority !== 'all' && lead.priority !== selectedPriority) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'value_desc') {
        return (b.dealValue || 0) - (a.dealValue || 0);
      }
      if (sortBy === 'value_asc') {
        return (a.dealValue || 0) - (b.dealValue || 0);
      }
      if (sortBy === 'followup') {
        if (!a.nextFollowUpDate) return 1;
        if (!b.nextFollowUpDate) return -1;
        return new Date(a.nextFollowUpDate).getTime() - new Date(b.nextFollowUpDate).getTime();
      }
      if (sortBy === 'name_asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
}

export function computeStats(leads: Lead[]): Stats {
  const totalLeads = leads.length;
  const activeLeads = leads.filter((l) => l.stage !== 'won' && l.stage !== 'lost');
  const wonLeads = leads.filter((l) => l.stage === 'won');
  const lostLeads = leads.filter((l) => l.stage === 'lost');

  const activePipelineValue = activeLeads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);
  const wonRevenue = wonLeads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);
  const lostRevenue = lostLeads.reduce((sum, l) => sum + (Number(l.dealValue) || 0), 0);

  const closedCount = wonLeads.length + lostLeads.length;
  const winRate = closedCount > 0 ? Math.round((wonLeads.length / closedCount) * 100) : 0;
  const avgDealSize = totalLeads > 0 ? Math.round((activePipelineValue + wonRevenue) / totalLeads) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const followUpsDueCount = leads.filter(
    (l) => l.nextFollowUpDate && l.nextFollowUpDate <= todayStr && l.stage !== 'won' && l.stage !== 'lost'
  ).length;

  return {
    totalLeads,
    activePipelineValue,
    wonRevenue,
    lostRevenue,
    winRate,
    avgDealSize,
    followUpsDueCount,
  };
}
