import React, { useState } from 'react';
import { BrandIcon } from '../common/BrandLogo';
import { X, CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react';

export type InterestType = 'try_demo' | 'subscribe' | 'custom_deal';

const INTEREST_OPTIONS: { id: InterestType; label: string }[] = [
  { id: 'try_demo', label: 'Nak cuba demo dulu' },
  { id: 'subscribe', label: 'Nak subscribe pakej' },
  { id: 'custom_deal', label: 'Nak discuss custom deal' },
];

const DEV_PHONE = '60135928812';

interface RequestDemoModalProps {
  open: boolean;
  onClose: () => void;
  defaultInterest?: InterestType;
}

export default function RequestDemoModal({ open, onClose, defaultInterest = 'try_demo' }: RequestDemoModalProps) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interestType, setInterestType] = useState<InterestType>(defaultInterest);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (open) setInterestType(defaultInterest);
  }, [open, defaultInterest]);

  if (!open) return null;

  const resetAndClose = () => {
    setName('');
    setCompany('');
    setPhone('');
    setEmail('');
    setMessage('');
    setSuccess(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!phone.trim() && !email.trim())) {
      setError('Sila isi Nama dan sekurang-kurangnya satu — Nombor WhatsApp atau Emel.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, company, phone, email, interestType, message }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || 'Gagal hantar borang. Sila cuba lagi.');
      }
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal hantar borang. Sila cuba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div onClick={resetAndClose} className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-fade-in" />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 animate-fade-in">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-900">
          <div className="flex items-center gap-2.5">
            <BrandIcon className="w-8 h-8" />
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Request Demo</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Kami akan hubungi anda tak lama lagi</p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="p-8 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Terima kasih!</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Permintaan demo anda dah diterima. Kami akan hubungi anda tak lama lagi.
            </p>
            <a
              href={`https://wa.me/${DEV_PHONE}?text=${encodeURIComponent('Hi Sharil, saya baru submit Request Demo form untuk LeadFlow CRM.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <MessageSquare className="w-4 h-4" />
              Atau terus WhatsApp kami
            </a>
            <button
              onClick={resetAndClose}
              className="mt-4 min-h-[44px] w-full rounded-xl border border-zinc-300 dark:border-zinc-700 font-bold text-sm text-zinc-700 dark:text-zinc-200 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Nama Penuh *</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full min-h-[44px] px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Nama Syarikat</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 w-full min-h-[44px] px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">No. WhatsApp</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="012-345 6789"
                  className="mt-1 w-full min-h-[44px] px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Emel</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full min-h-[44px] px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Saya berminat untuk...</label>
              <div className="mt-1.5 flex flex-col gap-1.5">
                {INTEREST_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                      interestType === opt.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold'
                        : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="interestType"
                      className="accent-emerald-600"
                      checked={interestType === opt.id}
                      onChange={() => setInterestType(opt.id)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Mesej (Pilihan)</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="mt-1 w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {error && <p className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 min-h-[44px] w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              {submitting ? 'Menghantar…' : 'Hantar Request Demo'}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
