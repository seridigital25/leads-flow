import React, { useState, useRef, useEffect } from 'react';
import { useLeads } from '../../context/LeadContext';
import BrandLogo from '../common/BrandLogo';
import AboutModal from '../modals/AboutModal';
import { 
  Kanban, 
  Table2, 
  BarChart3, 
  Plus, 
  Zap, 
  Download, 
  RotateCcw, 
  Moon, 
  Sun, 
  ChevronDown, 
  Info,
  ExternalLink
} from 'lucide-react';

export default function Navbar() {
  const { 
    leads,
    maxLeads,
    isLimitReached,
    viewMode, 
    setViewMode, 
    darkMode, 
    setDarkMode, 
    setIsAddModalOpen, 
    quickAddDemoLead,
    resetToDefaults,
    exportData,
    showToast
  } = useLeads();

  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenAddModal = () => {
    if (isLimitReached) {
      showToast(`Mockup limit reached: Demo is limited to max ${maxLeads} leads. Delete an existing lead to create a new one.`, 'error');
    }
    setIsAddModalOpen(true);
  };

  return (
    <>
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs px-4 flex items-center justify-between shrink-0 select-none z-20 transition-colors">
        {/* Brand & Workspace */}
        <div className="flex items-center gap-4 sm:gap-6">
          <BrandLogo size="md" onClick={() => setAboutModalOpen(true)} />

          {/* View Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/70 rounded-lg border border-zinc-200/80 dark:border-zinc-700/80 text-xs font-medium">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                viewMode === 'analytics'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Funnel & Analytics</span>
            </button>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mockup Limit Pill Indicator */}
          <div className={`hidden sm:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md border ${
            isLimitReached
              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-semibold'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700'
          }`} title={`Mockup is limited to ${maxLeads} leads`}>
            <span>{leads.length}/{maxLeads} Leads</span>
            {isLimitReached && <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">(Max)</span>}
          </div>

          {/* Quick Demo Simulator button */}
          <button
            onClick={quickAddDemoLead}
            disabled={isLimitReached}
            title={isLimitReached ? `Mockup limit reached (${maxLeads}/${maxLeads} leads)` : "Simulate an instant incoming lead from Meta Ads or TikTok webhook"}
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md border transition-all shadow-2xs ${
              isLimitReached
                ? 'opacity-50 cursor-not-allowed bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 cursor-pointer'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>⚡ Simulate Inbound Lead</span>
          </button>

          {/* Primary Add Lead Button */}
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Lead</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Dark / Light Mode"
            className="p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings / Data Options Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 py-1.5 z-50 text-xs font-medium animate-fade-in">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                  Workspace & Engine
                </div>
                
                <button
                  onClick={() => {
                    setAboutModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>About LeadFlow CRM</span>
                </button>

                <button
                  onClick={() => {
                    exportData();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Export Leads (JSON)</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset all leads back to the default sample dataset?')) {
                      resetToDefaults();
                    }
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Sample Data</span>
                </button>

                <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                <div className="px-3 py-1.5 text-[11px] text-zinc-400 flex items-center justify-between">
                  <span>Mockup Limit:</span>
                  <span className="font-bold text-zinc-600 dark:text-zinc-300">Max {maxLeads} Leads</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* About LeadFlow Modal */}
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} />
    </>
  );
}
