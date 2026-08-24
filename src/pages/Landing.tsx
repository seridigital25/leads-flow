import React, { useState } from 'react';
import BrandLogo, { BrandIcon } from '../components/common/BrandLogo';
import RequestDemoModal from '../components/modals/RequestDemoModal';
import {
  Zap,
  MessageSquare,
  Kanban,
  FileText,
  ShieldCheck,
  BarChart3,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Building2,
  Stethoscope,
  Home as HomeIcon,
  Paintbrush,
  Megaphone,
  Briefcase,
  Lock,
  ChevronDown,
  X as XIcon,
  Menu as MenuIcon,
  TrendingUp,
  Smartphone,
  ClipboardList,
} from 'lucide-react';

const DEV_PHONE = '60135928812';
const waLink = (msg: string) => `https://wa.me/${DEV_PHONE}?text=${encodeURIComponent(msg)}`;

const HERO_WA = waLink(
  'Hi Sharil, saya baru tengok landing page LeadFlow CRM dan berminat untuk tahu lebih lanjut / dapatkan demo.'
);
const PRICING_WA = (pkg: string) =>
  waLink(`Hi Sharil, saya berminat dengan pakej ${pkg} LeadFlow CRM. Boleh kongsikan lebih maklumat?`);

const FEATURES: { icon: React.ElementType; title: string; desc: string }[] = [
  {
    icon: MessageSquare,
    title: '1-Klik WhatsApp Closing',
    desc: '5 templat skrip jualan siap guna — pengenalan, follow-up sebut harga, jemputan demo, tawaran had masa, dan recovery prospek yang senyap.',
  },
  {
    icon: Kanban,
    title: 'Kanban Pipeline Visual',
    desc: 'Drag & drop prospek merentasi New Leads → Contacted → Qualified → Proposal Sent → Closed Won, dengan jumlah RM setiap lajur secara live.',
  },
  {
    icon: FileText,
    title: 'Quotation & Invois Rasmi',
    desc: 'Jana sebut harga dan invois cukai bernombor siri rasmi, cetakan A4 bersih tanpa navigasi aplikasi — terus boleh emel ke pelanggan.',
  },
  {
    icon: CheckCircle2,
    title: 'Kelayakan BANT',
    desc: 'Semak Budget, Authority, Need & Timeline sebelum hantar sebut harga — elak buang masa quote kepada prospek yang belum bersedia.',
  },
  {
    icon: BarChart3,
    title: 'Attribution Meta & TikTok Ads',
    desc: 'Jejak jumlah lead, nilai jualan RM, dan kadar tutup jualan (win rate) ikut saluran iklan — buktikan ROI kempen dengan data sebenar.',
  },
  {
    icon: Clock,
    title: 'Follow-Up Scheduler',
    desc: 'Penjadual susulan pantas dengan pintasan Hari Ini / Esok / +3 Hari, dan lencana "overdue" supaya tiada prospek yang tersadai.',
  },
  {
    icon: TrendingUp,
    title: 'Analitik Funnel Jualan',
    desc: 'Corong penurunan (drop-off) setiap peringkat pipeline dan sebab kalah jualan — Harga Tinggi, Pesaing, Ghosting, Tak Sesuai, Ditunda.',
  },
  {
    icon: Lock,
    title: '100% Data Peribadi Anda',
    desc: 'Seni bina Zero-Backend — data prospek tersimpan terus di pelayar anda, bukan di server luar negara. Eksport JSON bila-bila masa.',
  },
];

const PROBLEMS = [
  {
    stat: '15 minit',
    label: 'Lead iklan mula sejuk',
    desc: 'Prospek dari Meta & TikTok Ads mula hilang minat secepat 15 minit tanpa balasan — tapi kebanyakan sales rep baru reply berjam-jam kemudian.',
  },
  {
    stat: 'RM 2,300+',
    label: 'Kos CRM antarabangsa / bulan',
    desc: 'HubSpot, Salesforce & Zoho boleh mencecah USD 500–1,200 sebulan, dengan borang rumit yang jarang digunakan sepenuhnya oleh sales rep tempatan.',
  },
  {
    stat: '30–40%',
    label: 'Jualan hilang bukan sebab iklan',
    desc: 'Ramai bisnes hilang jualan bukan sebab iklan tak berkesan, tapi sebab tiada sistem susulan WhatsApp yang pantas dan konsisten.',
  },
];

const INDUSTRIES: { icon: React.ElementType; title: string; pain: string; deal: string }[] = [
  {
    icon: Stethoscope,
    title: 'Klinik & MedSpa / Estetik',
    pain: 'Lead bertimbun dari TikTok tapi staf lambat reply & terlupa status deposit.',
    deal: 'RM 1,500 – RM 15,000 / rawatan',
  },
  {
    icon: HomeIcon,
    title: 'Hartanah & Kontraktor',
    pain: 'Kitaran jualan panjang, perlu susulan berjadual & checklist BANT.',
    deal: 'RM 150k – RM 800k / deal',
  },
  {
    icon: Paintbrush,
    title: 'Interior Design & Renovation',
    pain: 'Perlu hantar & pantau status sebut harga yang banyak dan berselerak.',
    deal: 'RM 20k – RM 100k+ / projek',
  },
  {
    icon: Megaphone,
    title: 'Agensi Pemasaran Digital',
    pain: 'Klien komplen "lead tak berkualiti" walhal sales rep mereka lambat hubungi.',
    deal: 'Retainer RM 4.5k – RM 12k',
  },
  {
    icon: Briefcase,
    title: 'Firma B2B Services',
    pain: 'Perlu quotation & invois rasmi tanpa bayar software perakaunan kompleks.',
    deal: 'Peguam, Akauntan, Konsultan',
  },
];

const PRICING = [
  {
    name: 'Starter',
    tag: 'Solo Closer',
    price: 'RM 99',
    period: '/ bulan',
    note: 'atau RM 890/tahun — jimat 25%',
    features: [
      '1 pengguna',
      'Kanban pipeline penuh',
      'Sehingga 50 leads',
      'WhatsApp 1-Klik',
      'Mod Gelap / Terang',
    ],
    highlight: false,
  },
  {
    name: 'Growth',
    tag: 'SME Pro',
    price: 'RM 249',
    period: '/ bulan',
    note: 'atau RM 2,390/tahun',
    features: [
      '5 pengguna',
      'Leads tanpa had',
      'Kelayakan BANT',
      'Quotation & Invois PDF',
      'Attribution saluran iklan',
    ],
    highlight: true,
  },
  {
    name: 'Enterprise',
    tag: 'Agency',
    price: 'RM 499',
    period: '/ bulan',
    note: 'atau RM 4,790/tahun',
    features: [
      'Pengguna tanpa had',
      'Custom branding & logo',
      'Sokongan keutamaan',
      'Eksport data penuh',
      'Analitik funnel lanjutan',
    ],
    highlight: false,
  },
];

const FAQS = [
  {
    q: 'Apakah itu LeadFlow CRM Malaysia?',
    a: 'LeadFlow CRM adalah sistem pengurusan prospek (CRM) dan saluran jualan WhatsApp pantas yang direka khas untuk pasaran Malaysia. Ia memudahkan pasukan jualan menguruskan prospek iklan Meta Ads dan TikTok Ads, menggerakkan prospek dalam papan Kanban, serta menjana sebut harga (Quotation) dan Invois Cukai rasmi dalam Ringgit Malaysia (RM).',
  },
  {
    q: 'Bagaimanakah fungsi 1-Klik WhatsApp membantu menutup jualan?',
    a: 'LeadFlow CRM menukar sebarang format nombor telefon Malaysia (cth: 012-345 6789 atau +6011...) secara automatik kepada format wa.me standard. Jurujual boleh terus menghantar mesej tersuai menggunakan 5 templat skrip closing tanpa perlu menyimpan nombor telefon secara manual.',
  },
  {
    q: 'Bolehkah LeadFlow CRM mengesan sumber prospek dari Meta Ads dan TikTok Ads?',
    a: 'Ya, LeadFlow CRM mempunyai modul attribution saluran yang menjejak jumlah prospek, nilai jualan terkumpul (RM), dan kadar penukaran (win rate) daripada Meta Ads, TikTok Ads, Google Search, Borang Laman Web, WhatsApp Terus, dan Rujukan.',
  },
  {
    q: 'Bolehkah sistem ini menjana Quotation dan Invois rasmi?',
    a: 'Ya. Anda boleh mencipta sebut harga dan invois cukai dengan nombor siri rasmi, perincian produk/servis, maklumat SSM syarikat, akaun bank, dan mencetak dokumen A4 kemas tanpa navigasi aplikasi kelihatan.',
  },
  {
    q: 'Adakah data prospek saya selamat dan peribadi?',
    a: 'Ya. LeadFlow CRM menggunakan seni bina Zero-Backend di mana seluruh data prospek anda disimpan terus di dalam pelayar anda (LocalStorage) tanpa dimuat naik ke pelayan luar. Anda boleh eksport data dalam format JSON bila-bila masa.',
  },
  {
    q: 'Bolehkah sistem ini dijenamakan semula (white-label) untuk syarikat saya?',
    a: 'Boleh. Selain pelan langganan bulanan, kami tawarkan pakej White-Label one-off (custom logo, warna korporat & domain sendiri) berserta sesi latihan untuk pasukan jualan anda. Hubungi kami di WhatsApp untuk sebut harga.',
  },
];

function NavBar() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/85 dark:bg-zinc-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="shrink-0">
          <BrandLogo size="md" />
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
          <a href="#ciri" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Ciri-Ciri</a>
          <a href="#industri" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Untuk Siapa</a>
          <a href="#harga" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Harga</a>
          <a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Soalan Lazim</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="/demo"
            className="min-h-[44px] inline-flex items-center gap-1.5 px-4 rounded-lg text-sm font-bold text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Live Demo
          </a>
          <a
            href={HERO_WA}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center gap-1.5 px-4 rounded-lg text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Hubungi Kami
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer"
        >
          {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-5 py-4 flex flex-col gap-1 animate-fade-in">
          {[
            ['Ciri-Ciri', '#ciri'],
            ['Untuk Siapa', '#industri'],
            ['Harga', '#harga'],
            ['Soalan Lazim', '#faq'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="min-h-[44px] flex items-center px-2 rounded-lg text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 transition-colors"
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-zinc-200 dark:border-zinc-800">
            <a href="/demo" className="min-h-[44px] flex items-center justify-center rounded-lg text-sm font-bold text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700">
              Live Demo
            </a>
            <a
              href={HERO_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] flex items-center justify-center gap-1.5 rounded-lg text-sm font-bold bg-emerald-600 text-white"
            >
              <MessageSquare className="w-4 h-4" />
              Hubungi Kami
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroMockup() {
  const cols = [
    { label: 'New Leads', color: 'bg-sky-500', cards: 3 },
    { label: 'Contacted', color: 'bg-amber-500', cards: 2 },
    { label: 'Qualified', color: 'bg-violet-500', cards: 2 },
    { label: 'Closed Won', color: 'bg-emerald-500', cards: 1 },
  ];
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.25),transparent_60%)] blur-2xl motion-reduce:hidden"
      />
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-emerald-950/40 overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800 bg-zinc-900/60">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-3 text-[11px] font-mono text-zinc-500">myleads-flow.vercel.app/demo</span>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BrandIcon className="w-6 h-6" />
              <span className="text-xs font-bold text-zinc-200">Sales Pipeline</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800/80">RM 128,400</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {cols.map((col) => (
              <div key={col.label} className="rounded-lg bg-zinc-900/80 border border-zinc-800 p-2 flex flex-col gap-2">
                <div className="flex items-center gap-1.5 px-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${col.color}`} />
                  <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 truncate">{col.label}</span>
                </div>
                {Array.from({ length: col.cards }).map((_, i) => (
                  <div key={i} className="rounded-md bg-zinc-800/80 border border-zinc-700/80 p-2 flex flex-col gap-1.5">
                    <div className="h-1.5 w-3/4 rounded-full bg-zinc-600" />
                    <div className="h-1.5 w-1/2 rounded-full bg-zinc-700" />
                    <div className="h-3.5 w-10 rounded bg-emerald-900/60 border border-emerald-800/60" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden sm:flex absolute -right-4 -bottom-5 items-center gap-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl px-3.5 py-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
          <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="leading-tight">
          <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">WhatsApp dihantar</div>
          <div className="text-[10px] text-zinc-500 font-mono">1-klik · 0.8s</div>
        </div>
      </div>

      <div className="hidden sm:flex absolute -left-5 -top-5 items-center gap-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-xl px-3.5 py-2.5">
        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <div className="leading-tight">
          <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">Win Rate 42%</div>
          <div className="text-[10px] text-zinc-500 font-mono">bulan ini</div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <NavBar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_-10%,rgba(16,185,129,0.12),transparent_45%)]"
        />
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 pb-20 md:pt-20 md:pb-28 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/70 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Dibina Khas Untuk Pasaran Malaysia
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.08]">
              Capture fast.
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">Close faster.</span>
            </h1>

            <p className="mt-5 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
              CRM &amp; WhatsApp sales pipeline yang pastikan setiap lead iklan Meta &amp; TikTok Ads anda
              di-follow-up dalam <strong className="text-zinc-900 dark:text-zinc-100">minit — bukan hari</strong>.
              Kanban visual, quotation PDF rasmi, dan 1-klik WhatsApp closing — semua native Ringgit Malaysia.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <ClipboardList className="w-4 h-4" />
                Request Demo
              </button>
              <a
                href="/demo"
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 font-bold text-zinc-800 dark:text-zinc-100 transition-colors cursor-pointer"
              >
                Cuba Live Demo Percuma
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Tiada kad kredit diperlukan</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 100% Data Peribadi Anda</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> RM Native</span>
            </div>
          </div>

          <div className="lg:pl-6">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight">Kenapa banyak bisnes masih hilang jualan?</h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Belanja iklan makin mahal, tapi sales rep masih guna Excel, buku nota, atau CRM antarabangsa yang
              terlalu kompleks untuk pasaran WhatsApp-first macam Malaysia.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-3 gap-5">
            {PROBLEMS.map((p) => (
              <div key={p.label} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-6">
                <div className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">{p.stat}</div>
                <div className="mt-1.5 font-bold text-zinc-900 dark:text-zinc-100">{p.label}</div>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="ciri" className="scroll-mt-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight">Semua yang sales team anda perlukan, dalam satu tempat</h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Dibina untuk kelajuan — bukan borang rumit yang tak pernah diisi penuh.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-emerald-400 dark:hover:border-emerald-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="mt-4 font-bold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="text-3xl font-extrabold tracking-tight text-center">LeadFlow CRM vs. CRM Antarabangsa</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-center max-w-xl mx-auto">
            Dibina khas untuk cara bisnes Malaysia benar-benar tutup jualan — di WhatsApp.
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <caption className="sr-only">Perbandingan LeadFlow CRM dengan CRM antarabangsa</caption>
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th scope="col" className="text-left py-3 pr-4 font-bold text-zinc-500 dark:text-zinc-400">Ciri</th>
                  <th scope="col" className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-t-lg text-center">LeadFlow CRM</th>
                  <th scope="col" className="py-3 px-4 font-bold text-zinc-500 dark:text-zinc-400 text-center">CRM Antarabangsa</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Harga bulanan', 'RM 99 – RM 499', 'RM 2,300 – RM 5,600'],
                  ['WhatsApp 1-Klik native', 'Ya', 'Perlu integrasi pihak ke-3'],
                  ['Mata wang & format tempatan', 'Ringgit Malaysia (RM)', 'USD, perlu tukar manual'],
                  ['Quotation & Invois A4 rasmi', 'Terbina dalam', 'Perlu app berasingan'],
                  ['Lokasi data', 'Pelayar anda (LocalStorage)', 'Server luar negara'],
                  ['Masa setup', 'Minit', 'Minggu / bulan'],
                ].map(([label, us, them], i) => (
                  <tr key={label} className={i % 2 === 0 ? 'bg-zinc-50/60 dark:bg-zinc-950/30' : ''}>
                    <td className="py-3 pr-4 font-semibold text-zinc-700 dark:text-zinc-300">{label}</td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20">{us}</td>
                    <td className="py-3 px-4 text-center text-zinc-500 dark:text-zinc-400">{them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section id="industri" className="scroll-mt-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight">Sesuai untuk industri apa?</h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Mana-mana bisnes yang bergantung pada iklan berbayar dan closing di WhatsApp.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map((ind) => (
              <div key={ind.title} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  <ind.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="mt-4 font-bold text-zinc-900 dark:text-zinc-100">{ind.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">{ind.pain}</p>
                <div className="mt-3 inline-flex self-start items-center px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                  {ind.deal}
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 p-6 flex flex-col justify-center items-start gap-3">
              <Building2 className="w-8 h-8 text-zinc-400" />
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Industri lain? Kami boleh sesuaikan pipeline &amp; templat WhatsApp ikut proses jualan anda.
              </p>
              <a
                href={HERO_WA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Bincang dengan kami <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="harga" className="scroll-mt-16 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Harga telus, tiada kejutan</h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Pilih pakej ikut saiz pasukan jualan anda. Boleh naik taraf bila-bila masa.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6 items-start">
            {PRICING.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl p-7 flex flex-col h-full ${
                  pkg.highlight
                    ? 'border-2 border-emerald-500 bg-zinc-50 dark:bg-zinc-950 shadow-xl shadow-emerald-500/10 md:-translate-y-3 relative'
                    : 'border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {pkg.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold tracking-wide">
                    PALING POPULAR
                  </span>
                )}
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{pkg.tag}</div>
                <h3 className="mt-1 text-xl font-extrabold text-zinc-900 dark:text-zinc-100">{pkg.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-mono tracking-tight">{pkg.price}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 font-semibold">{pkg.period}</span>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{pkg.note}</div>

                <ul className="mt-6 flex flex-col gap-2.5 flex-1">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={PRICING_WA(pkg.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-7 min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
                    pkg.highlight
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'border border-zinc-300 dark:border-zinc-700 hover:border-emerald-500 text-zinc-800 dark:text-zinc-100'
                  }`}
                >
                  Pilih {pkg.name}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Perlukan pemasangan white-label di domain syarikat sendiri?{' '}
            <a href={HERO_WA} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Tanya pakej Enterprise / White-Label
            </a>
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-3xl font-extrabold tracking-tight text-center">Bermula dalam 3 langkah</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: 'Lead masuk automatik',
              desc: 'Prospek dari borang iklan Meta / TikTok Ads atau webhook terus muncul dalam Kanban pipeline anda.',
            },
            {
              icon: MessageSquare,
              title: 'Susul & closing di WhatsApp',
              desc: 'Buka WhatsApp dengan mesej tersuai 1-klik, semak BANT, dan jadualkan follow-up automatik.',
            },
            {
              icon: FileText,
              title: 'Jana dokumen & tutup jualan',
              desc: 'Hantar sebut harga PDF, tukar kepada invois rasmi, dan pindah lead ke Closed Won.',
            },
          ].map((step, i) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center">
                <step.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="mx-auto mt-3 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                {i + 1}
              </div>
              <h3 className="mt-3 font-bold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY STRIP */}
      <section className="border-y border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-black">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-zinc-300">
          {[
            [ShieldCheck, 'Header Keselamatan Enterprise'],
            [Lock, 'Zero-Backend & LocalStorage'],
            [Smartphone, 'Responsif Penuh Mobile'],
          ].map(([Icon, label]) => {
            const IconComp = Icon as React.ElementType;
            return (
              <div key={label as string} className="flex items-center gap-2 text-sm font-semibold">
                <IconComp className="w-4 h-4 text-emerald-400" />
                {label as string}
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-16 max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className="text-3xl font-extrabold tracking-tight text-center">Soalan Lazim</h2>
        <div className="mt-10 flex flex-col gap-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-zinc-200 dark:border-zinc-800 open:border-emerald-400 dark:open:border-emerald-700 px-5 py-4"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-zinc-900 dark:text-zinc-100">
                {item.q}
                <ChevronDown className="w-4 h-4 shrink-0 text-zinc-500 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-20 md:pb-28">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 dark:bg-black px-6 sm:px-14 py-14 sm:py-16 text-center">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.25),transparent_60%)]"
          />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Sedia untuk stop kehilangan lead?
            </h2>
            <p className="mt-3 text-zinc-400 max-w-xl mx-auto">
              Isi Request Demo sekarang, atau cuba live demo percuma tanpa perlu daftar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setDemoModalOpen(true)}
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-7 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition-all hover:scale-[1.02] cursor-pointer"
              >
                <ClipboardList className="w-4 h-4" />
                Request Demo
              </button>
              <a
                href="/demo"
                className="min-h-[44px] inline-flex items-center justify-center gap-2 px-7 rounded-xl border border-zinc-700 hover:border-emerald-500 font-bold text-white transition-colors cursor-pointer"
              >
                Cuba Live Demo Percuma
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <a
              href={HERO_WA}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-emerald-400 hover:underline"
            >
              <MessageSquare className="w-4 h-4" /> Atau WhatsApp kami terus
            </a>
          </div>
        </div>
      </section>

      <RequestDemoModal open={demoModalOpen} onClose={() => setDemoModalOpen(false)} />

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <BrandLogo size="sm" />
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            <a href="#ciri" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Ciri-Ciri</a>
            <a href="#harga" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Harga</a>
            <a href="/demo" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Live Demo</a>
            <a href={HERO_WA} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">WhatsApp</a>
          </nav>
          <p className="text-xs text-zinc-400 dark:text-zinc-600 font-mono">© 2026 LeadFlow CRM Malaysia</p>
        </div>
      </footer>
    </div>
  );
}
