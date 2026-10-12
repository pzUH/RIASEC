import React from 'react';
import { AssessmentResult } from '../types/riasec';
import { RIASEC_DIMENSIONS } from '../data/riasecData';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Shield,
  FileSpreadsheet,
  Share2,
  Clock,
  Award,
  BookOpen,
  Layers,
  ChevronRight
} from 'lucide-react';

interface HomeViewProps {
  lastResult: AssessmentResult | null;
  onStartTest: () => void;
  onViewResult: () => void;
  onOpenAbout: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  lastResult,
  onStartTest,
  onViewResult,
  onOpenAbout
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-32">
      {/* Hero Section */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden mb-8">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-28 -right-28 w-72 h-72 bg-indigo-500/35 rounded-full blur-3xl pointer-events-none animate-orb-1" />
        <div className="absolute -bottom-28 -left-28 w-72 h-72 bg-pink-500/25 rounded-full blur-3xl pointer-events-none animate-orb-2" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Asesmen Karir Ilmiah Berbasis Teori Holland</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Kenali Potensi Diri Lewat{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-400 bg-clip-text text-transparent">
              RIASEC Explorer
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
            Petakan keselarasan antara kepribadian, gaya kerja, dan pilihan karir ideal Anda menggunakan model tipologi 6 dimensi John L. Holland. Dapatkan 3 Kode Holland utama serta rekomendasi profesi dan program studi masa depan.
          </p>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 my-6 text-xs text-slate-300">
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              12 Soal Ringkas (~3 Menit)
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              6 Tipe Kepribadian
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Ekspor Laporan Excel
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-rose-400" />
              100% Privat di Browser
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onStartTest}
              className="px-7 py-3.5 rounded-2xl glass-button-primary text-white font-bold text-sm flex items-center gap-2.5 shadow-xl"
            >
              <Compass className="w-4 h-4 text-cyan-300" />
              <span>Mulai Asesmen Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAbout}
              className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Pelajari Teori RIASEC</span>
            </button>
          </div>
        </div>
      </div>

      {/* Last Result Card (if exists) */}
      {lastResult && (
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-indigo-500/30 shadow-xl mb-8 relative overflow-hidden bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-purple-950/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Hasil Asesmen Terakhir Tersimpan</span>
              </div>
              <div className="text-lg font-extrabold text-white">
                {lastResult.userName} ({lastResult.userAge} th)
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kode Holland:{' '}
                <strong className="text-cyan-300 tracking-wider text-sm">
                  {lastResult.topCode}
                </strong>{' '}
                • {new Date(lastResult.timestamp).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onViewResult}
                className="px-4 py-2.5 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-400/40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
              >
                <span>Buka Hasil & Kartu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6 RIASEC Dimensions Interactive Grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              6 Dimensi Model John Holland
            </h2>
            <p className="text-xs text-slate-400">
              Setiap individu memiliki kombinasi unik dari keenam tipe kepribadian ini
            </p>
          </div>
          <button
            onClick={onOpenAbout}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <span>Detail Lengkap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(['R', 'I', 'A', 'S', 'E', 'C'] as const).map((code) => {
            const dim = RIASEC_DIMENSIONS[code];
            return (
              <div
                key={code}
                className="glass-card glass-card-interactive p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shadow-md border"
                      style={{
                        backgroundColor: `${dim.color}25`,
                        borderColor: dim.color,
                        color: dim.color
                      }}
                    >
                      {dim.code}
                    </div>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${dim.color}15`,
                        color: dim.color
                      }}
                    >
                      {dim.nameEn}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">
                    {dim.nameId}
                  </h3>
                  <div className="text-[11px] font-semibold text-slate-400 mb-2">
                    {dim.archetypeId}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                    {dim.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-1">
                  {dim.coreTraits.slice(0, 3).map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-slate-300 border border-white/5"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Highlights Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15">
        <h2 className="text-base sm:text-lg font-bold text-white mb-4">
          Fitur Unggulan RIASEC Explorer
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Ekspor Excel (.xlsx)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Kompilasi otomatis data asesmen, skor tiap dimensi, profil karir, dan jawaban 12 soal ke file spreadsheet siap pakai via SheetJS.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Share2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Kartu Hasil Visual (PNG)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Desain kartu ringkasan hasil yang estetis dengan Liquid Glassmorphism, dapat diunduh atau dibagikan via Web Share API di ponsel.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Diagram Hexagon Holland</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Visualisasi poligon interaktif yang mencerminkan derajat keselarasan tipe kepribadian bersebelahan dan berlawanan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
