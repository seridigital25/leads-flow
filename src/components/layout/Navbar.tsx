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
  MessageSquare,
  ClipboardList,
  LogOut,
  FileBarChart,
  Users,
  Radio,
  ScrollText,
  FileSpreadsheet,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({ onRequestDemo }: { onRequestDemo?: () => void }) {
  const {
    mode,
    signOut,
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
    exportCsv,
    showToast
  } = useLeads();
  const isOwner = mode === 'owner';

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const developerPhone = '60135928812';
  const waMessage = encodeURIComponent(
    'Hi Sharil, I tried the LeadFlow CRM POC prototype and I am interested in discussing a custom CRM / web application build for my business.'
  );
  const waUrl = `https://wa.me/${developerPhone}?text=${waMessage}`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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
          <BrandLogo size="md" onClick={() => { window.location.href = '/'; }} />

          {/* View Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/70 rounded-lg border border-zinc-200/80 dark:border-zinc-700/80 text-xs font-medium overflow-x-auto max-w-[52vw] lg:max-w-none">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'analytics'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setViewMode('reports')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'reports'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <FileBarChart className="w-3.5 h-3.5" />
              <span>Reports</span>
            </button>
            <button
              onClick={() => setViewMode('contacts')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'contacts'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Contacts</span>
            </button>
            <button
              onClick={() => setViewMode('sources')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'sources'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Sources</span>
            </button>
            <button
              onClick={() => setViewMode('audit')}
              className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'audit'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>Audit</span>
            </button>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isOwner ? (
            <button
              onClick={signOut}
              title="Sign out of Owner CRM"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-2xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <button
              onClick={onRequestDemo}
              title="Isi Request Demo untuk bincang custom CRM / SaaS solutions"
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-2xs cursor-pointer hover:scale-[1.02]"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Request Demo</span>
            </button>
          )}

          {!isOwner && (
            <>
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
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 cursor-pointer'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>⚡ Simulate Lead</span>
              </button>
            </>
          )}

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
            onClick={() => setDarkMode((prev: boolean) => !prev)}
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
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 py-1.5 z-50 text-xs font-medium animate-fade-in">
                {!isOwner && (
                  <>
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
                      POC & Developer
                    </div>

                    {/* Request Demo in dropdown */}
                    <button
                      onClick={() => {
                        onRequestDemo?.();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors font-semibold cursor-pointer"
                    >
                      <ClipboardList className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Request Demo</span>
                    </button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left px-3 py-2 flex items-center gap-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Atau WhatsApp terus</span>
                    </a>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
                  </>
                )}

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
                  <Info className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span>Panduan Ciri &amp; FAQ / About</span>
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
                    exportCsv();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Export Leads (CSV)</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode('audit');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <ScrollText className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Audit Trail</span>
                </button>

                <button
                  onClick={() => {
                    setViewMode('privacy');
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Privacy Notice</span>
                </button>

                {isOwner ? (
                  <button
                    onClick={() => {
                      signOut?.();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* About LeadFlow Modal */}
      <AboutModal isOpen={aboutModalOpen} onClose={() => setAboutModalOpen(false)} onRequestDemo={onRequestDemo} />
    </>
  );
}
