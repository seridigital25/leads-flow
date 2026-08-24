import React, { useState } from 'react';
import { useLeads } from '../../context/LeadContext';
import { BrandIcon } from '../common/BrandLogo';
import { 
  X,
  Sparkles,
  Smartphone,
  Heart,
  MessageSquare,
  ClipboardList,
  ShieldCheck,
  Zap,
  FileText,
  HelpCircle,
  BarChart3,
  Layers,
  ChevronDown
} from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestDemo?: () => void;
}

export default function AboutModal({ isOpen, onClose, onRequestDemo }: AboutModalProps) {
  const { leads, stats } = useLeads();
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'faq'>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const developerPhone = '60135928812';
  const waMessage = encodeURIComponent(
    'Hi Sharil, saya cuba prototaip LeadFlow CRM (Malaysia RM Edition) dan berminat untuk bincang custom CRM / pembangunan web app jualan untuk bisnes saya.'
  );
  const waUrl = `https://wa.me/${developerPhone}?text=${waMessage}`;

  const faqs = [
    {
      q: 'Apakah itu LeadFlow CRM Malaysia?',
      a: 'LeadFlow CRM adalah sistem pengurusan prospek (CRM) dan saluran jualan WhatsApp berprestasi tinggi yang direka khas untuk pasaran Malaysia. Ia memudahkan pasukan jualan menguruskan prospek iklan Meta Ads dan TikTok Ads, menggerakkan prospek dalam papan Kanban, serta menjana sebut harga (Quotation) dan Invois Cukai rasmi dalam Ringgit Malaysia (RM).'
    },
    {
      q: 'Bagaimanakah fungsi 1-Click WhatsApp mempercepatkan closing jualan?',
      a: 'LeadFlow CRM menukar sebarang format nombor telefon Malaysia (cth: 012-345 6789, +6011...) kepada format wa.me standard secara automatik. Jurujual boleh terus menghantar mesej tersuai menggunakan 5 templat skrip closing (Pengenalan, Follow-up Sebut Harga, Jemputan Demo, Tawaran Had Masa, dan Recovery Prospek) tanpa perlu menyimpan nombor telefon ke dalam buku kenalan.'
    },
    {
      q: 'Bolehkah sistem ini menjana Quotation dan Invois Cukai rasmi?',
      a: 'Ya. Anda boleh mencipta sebut harga (Quotation) dan Invois Cukai dengan nombor siri rasmi, perincian produk atau servis, maklumat pendaftaran SSM syarikat, akaun bank Maybank, dan mencetak dokumen dalam saiz A4 yang kemas tanpa memaparkan butang atau navigasi aplikasi.'
    },
    {
      q: 'Adakah LeadFlow CRM sesuai untuk pengiklan Meta Ads dan TikTok Ads di Malaysia?',
      a: 'Sangat sesuai. LeadFlow CRM mempunyai analisis saluran iklan (channel attribution) yang menjejak prospek masuk mengikut sumber seperti Meta Ads, TikTok Ads, Borang Laman Web, WhatsApp Terus, dan Carian Google bersama nilai jualan (RM) dan kadar penukaran (Win Rate).'
    },
    {
      q: 'Adakah data prospek selamat dan dilindungi privasi?',
      a: 'Ya. LeadFlow CRM menggunakan konsep Zero-Backend di mana seluruh data prospek disimpan terus di dalam penyemak imbas anda (LocalStorage) tanpa dimuat naik ke pelayan luar. Anda juga boleh mengeksport data dalam format fail JSON pada bila-bila masa.'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-fade-in max-h-[90vh] flex flex-col">
        {/* Header Hero Banner */}
        <div className="relative p-6 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 text-white border-b border-zinc-800 shrink-0">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <BrandIcon className="w-12 h-12 shadow-lg shadow-emerald-500/20" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight">
                  Lead<span className="text-emerald-400">Flow</span> CRM
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Malaysia RM Edition
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-medium">
                Sistem Pengurusan Prospek &amp; WhatsApp Sales CRM Malaysia
              </p>
            </div>
          </div>

          {/* Navigation Tabs inside Modal */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ringkasan POC
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'features'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ciri Utama CRM
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                activeTab === 'faq'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Soalan Lazim (FAQ)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-5 text-xs text-zinc-600 dark:text-zinc-300 overflow-y-auto flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-fade-in">
              {/* Developer Contact Card (POC Box) */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Bina Custom CRM untuk Bisnes Anda</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                    Developer: Sharil
                  </span>
                </div>

                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  Ini adalah prototaip <strong>Proof of Concept (POC)</strong> interaktif. Jika anda ingin membina sistem CRM khas dengan integrasi automatik iklan Meta / TikTok Ads, WhatsApp chatbot, sistem komisen sales, atau SaaS dashboard tersuai:
                </p>

                <button
                  onClick={() => {
                    onClose();
                    onRequestDemo?.();
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer hover:scale-[1.01]"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>Isi Request Demo</span>
                </button>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-center text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center gap-1"
                >
                  <MessageSquare className="w-3 h-3" /> Atau hubungi Sharil melalui WhatsApp
                </a>
              </div>

              {/* Workspace Telemetry */}
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Status &amp; Metrik Prototaip
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block font-sans">Prospek Aktif</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{leads.length} Rekod</span>
                  </div>
                  <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block font-sans">Win Rate</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{stats.winRate}%</span>
                  </div>
                  <div className="p-2.5 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[10px] text-zinc-400 block font-sans">Storan Selamat</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">LocalStorage</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FEATURES */}
          {activeTab === 'features' && (
            <div className="space-y-3 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                    <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>1-Click WhatsApp Direct</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Pelancar pantas <code className="text-emerald-600 dark:text-emerald-400">wa.me</code> dengan normalisasi nombor telefon tempatan Malaysia dan 5 templat skrip closing jualan.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                    <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span>Kanban Sales Pipeline</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Papan Kanban interaktif (Drag &amp; Drop) dengan peringkat: New Leads ➔ Contacted ➔ Qualified ➔ Proposal Sent ➔ Closed Won.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Quotation &amp; Invois Cukai (RM)</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Jana sebut harga dan invois cukai rasmi dengan pengiraan Ringgit Malaysia (RM) serta mod cetakan A4 profesional yang bersih.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                    <BarChart3 className="w-4 h-4 text-amber-500" />
                    <span>Saluran Meta &amp; TikTok Ads</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Ketahui saluran iklan mana yang membawa pulangan keuntungan tertinggi melalui analisis attribution dan visual funnel.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span>Kelayakan BANT &amp; Follow-Up</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Semakan Budget, Authority, Need, dan Timeline sebelum menghantar sebut harga rasmi serta peringatan tarikh tindakan susulan.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/60 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                    <ShieldCheck className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    <span>Zero-Backend Privasi 100%</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Storan data berada di peranti anda sendiri (LocalStorage) dengan pilihan eksport JSON pada bila-bila masa.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-2.5 animate-fade-in">
              <p className="text-[11px] text-zinc-400 mb-2">
                Soalan-soalan yang sering ditanya mengenai sistem CRM dan pengurusan prospek jualan di Malaysia:
              </p>

              {faqs.map((faq, index) => {
                const isExpanded = expandedFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800/40"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : index)}
                      className="w-full p-3 text-left font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-between gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors cursor-pointer"
                    >
                      <span className="text-xs">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                          isExpanded ? 'rotate-180 text-emerald-500' : ''
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="p-3 pt-0 text-[11px] text-zinc-600 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 leading-relaxed animate-fade-in">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer note */}
          <div className="pt-3 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
            <div className="flex items-center gap-1">
              <span>Dibangunkan oleh</span>
              <strong className="text-zinc-700 dark:text-zinc-300">Sharil</strong>
              <span>dengan</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            </div>

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold cursor-pointer hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
