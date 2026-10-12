import React, { useState } from 'react';
import { User, Calendar, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (name: string, age: number) => void;
  defaultName?: string;
  defaultAge?: number;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onStart,
  defaultName = '',
  defaultAge = 20
}) => {
  const [name, setName] = useState(defaultName);
  const [age, setAge] = useState<number | ''>(defaultAge || 20);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Mohon masukkan nama lengkap Anda.');
      return;
    }
    if (!age || Number(age) < 10 || Number(age) > 99) {
      setError('Mohon masukkan usia yang valid (antara 10 - 99 tahun).');
      return;
    }
    setError(null);
    onStart(name.trim(), Number(age));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel text-white overflow-hidden border border-white/20 shadow-2xl">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Mulai Asesmen RIASEC</h2>
              <p className="text-xs text-slate-400">Isi data profil Anda untuk personalisasi laporan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Nama Lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Contoh: Raden Ayu Kartini"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Usia (Tahun)
            </label>
            <input
              type="number"
              min={10}
              max={99}
              value={age}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : parseInt(e.target.value, 10);
                setAge(val);
                if (error) setError(null);
              }}
              placeholder="Contoh: 21"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Data Anda 100% tersimpan aman di peramban lokal (tanpa server luar).</span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl glass-button-primary font-semibold text-sm text-white"
            >
              <span>Lanjut ke Lembar Soal (12 Butir)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
