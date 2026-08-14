import React from 'react';
import { useLeads } from '../../context/LeadContext';
import { SOURCES, PRIORITIES } from '../../data/initialLeads';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
  SlidersHorizontal 
} from 'lucide-react';

export default function FilterToolbar() {
  const {
    searchQuery,
    setSearchQuery,
    sourceFilter,
    setSourceFilter,
    priorityFilter,
    setPriorityFilter,
    sortBy,
    setSortBy,
    filteredLeads,
    leads
  } = useLeads();

  const hasActiveFilters = searchQuery || sourceFilter !== 'all' || priorityFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setSourceFilter('all');
    setPriorityFilter('all');
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between gap-2.5">
      {/* Left: Search & Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search leads, companies, phone, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-7 py-1.5 text-xs rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Source Filter */}
        <div className="flex items-center">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 cursor-pointer"
          >
            <option value="all">All Sources</option>
            {SOURCES.map(src => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 cursor-pointer"
          >
            <option value="all">All Priorities</option>
            {PRIORITIES.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Right: Sort & Count */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Showing <strong className="text-zinc-800 dark:text-zinc-200">{filteredLeads.length}</strong> of {leads.length}
        </span>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 text-zinc-700 dark:text-zinc-300 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-400 cursor-pointer font-medium"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="deal-desc">Value: High to Low</option>
            <option value="deal-asc">Value: Low to High</option>
            <option value="followup">Follow-up Date</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
