import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AssessmentResult } from '../types/riasec';
import { getCombinedCodeSummary } from '../utils/riasecCalculator';
import {
  captureAndShareCard,
  downloadResultImage,
  copySummaryToClipboard
} from '../utils/exportUtils';
import { HexagonChart } from './HexagonChart';
import { CaptureCard } from './CaptureCard';
import {
  Share2,
  Download,
  Copy,
  RotateCcw,
  Sparkles,
  Briefcase,
  GraduationCap,
  Building2,
  Lightbulb,
  CheckCircle2,
  Calendar,
  User,
  Loader2
} from 'lucide-react';

interface ResultViewProps {
  result: AssessmentResult;
  onRetake: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onRetake,
  onShowToast
}) => {
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const summary = getCombinedCodeSummary(result.topCode);

  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#6366f1', '#ec4899', '#f59e0b', '#10b981']
      });
    } catch {
      // ignore in environments without canvas
    }
  }, []);

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const res = await captureAndShareCard(null, result);
      if (res.success) {
        onShowToast('success', res.message);
      } else {
        onShowToast('info', res.message);
      }
    } catch (err: any) {
      console.error(err);
      onShowToast('error', 'Gagal membagikan kartu. Mengunduh gambar sebagai cadangan...');
      try {
        await downloadResultImage(result);
        onShowToast('success', 'Gambar kartu hasil berhasil diunduh!');
      } catch {
        onShowToast('error', 'Terjadi kesalahan sistem saat memproses gambar.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadImage = async () => {
    try {
      setIsDownloading(true);
      await downloadResultImage(result);
      onShowToast('success', 'Kartu hasil PNG resolusi tinggi berhasil disimpan!');
    } catch (err) {
      console.error(err);
      onShowToast('error', 'Gagal mengunduh gambar kartu.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyText = async () => {
    try {
      setIsCopying(true);
      const ok = await copySummaryToClipboard(result);
      if (ok) {
        onShowToast('success', 'Ringkasan hasil berhasil disalin ke clipboard!');
      } else {
        onShowToast('info', 'Tidak dapat menyalin otomatis.');
      }
    } catch {
      onShowToast('error', 'Gagal menyalin ringkasan.');
    } finally {
      setIsCopying(false);
    }
  };

  const formattedDate = new Date(result.timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 pb-28">
      {/* Hero Result Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden mb-6 mt-4">
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Asesmen Holland RIASEC Selesai (24 Butir Soal)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Profil Karir Anda Telah Terpetakan
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <strong className="text-slate-200">{result.userName}</strong> ({result.userAge} th)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {formattedDate}
              </span>
            </div>
          </div>

          {/* Big Holland Code Badge Box */}
          <div className="flex flex-col items-start md:items-end bg-white/[0.04] p-4 sm:p-5 rounded-2xl border border-white/10 backdrop-blur-md">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              3 Kode Holland Utama
            </span>
            <div className="text-4xl sm:text-5xl font-black tracking-widest bg-gradient-to-r from-cyan-300 via-indigo-300 to-pink-400 bg-clip-text text-transparent my-1">
              {result.topCode}
            </div>
            <div className="flex gap-1.5 mt-1">
              {result.topCode.split('').map((ch, i) => {
                const d = result.sortedDimensions.find(sd => sd.dimension === ch);
                return (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                    style={{
                      backgroundColor: `${d?.info.color || '#6366f1'}30`,
                      color: d?.info.color || '#fff'
                    }}
                  >
                    {d?.info.nameId}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Narrative & Title */}
        <div className="relative z-10 pt-5">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-base sm:text-lg mb-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{summary.title}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            {summary.narrative}
          </p>
        </div>

        {/* Action Buttons Row - XLXS Button Removed per User Request */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-2.5 sm:gap-3">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl glass-button-primary text-white text-xs sm:text-sm font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all"
          >
            {isSharing ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Share2 className="w-4 h-4 text-cyan-300" />
            )}
            <span>Bagikan Hasil</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-400/40 text-cyan-200 text-xs sm:text-sm font-semibold transition-all shadow-md"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
            ) : (
              <Download className="w-4 h-4 text-cyan-300" />
            )}
            <span>Unduh Kartu (PNG)</span>
          </button>

          <button
            onClick={handleCopyText}
            disabled={isCopying}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs sm:text-sm font-medium transition-colors"
          >
            <Copy className="w-4 h-4 text-slate-400" />
            <span>Salin Teks</span>
          </button>

          <button
            onClick={onRetake}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs sm:text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Ulangi Tes</span>
          </button>
        </div>
      </div>

      {/* Grid: Holland Hexagon Chart & 6 Dimension Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Hexagon Diagram Card */}
        <div className="lg:col-span-5 glass-panel p-5 sm:p-6 rounded-3xl border border-white/15 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Hexagon Holland</span>
            </h3>
            <span className="text-[11px] text-slate-400">Skor Poligon</span>
          </div>

          <div className="py-2">
            <HexagonChart result={result} size={280} />
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-3 leading-relaxed">
            Teori John Holland menyatakan tipe yang bersebelahan pada hexagon memiliki keselarasan psikologis paling tinggi.
          </p>
        </div>

        {/* 6 Dimensions Breakdown */}
        <div className="lg:col-span-7 glass-panel p-5 sm:p-6 rounded-3xl border border-white/15">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Rincian Skor 6 Dimensi RIASEC</h3>
            <span className="text-[11px] text-slate-400">Skor Maksimal: 12 Poin</span>
          </div>

          <div className="space-y-3.5">
            {result.sortedDimensions.map((dim, idx) => {
              const isTop = idx < 3;
              return (
                <div
                  key={dim.dimension}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isTop
                      ? 'bg-white/[0.04] border-white/15'
                      : 'bg-white/[0.015] border-white/5 opacity-85'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs shadow-md border"
                        style={{
                          backgroundColor: `${dim.info.color}25`,
                          borderColor: dim.info.color,
                          color: dim.info.color
                        }}
                      >
                        {dim.dimension}
                      </span>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{dim.info.nameId}</span>
                          <span className="text-slate-400 text-[11px] font-normal">
                            ({dim.info.nameEn})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                          {dim.info.archetypeId}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-extrabold" style={{ color: dim.info.color }}>
                        {dim.score} / 12
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {dim.percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Animated Score Progress Bar */}
                  <div className="w-full bg-slate-900/90 rounded-full h-2 overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${dim.percentage}%`,
                        backgroundColor: dim.info.color,
                        boxShadow: `0 0 10px ${dim.info.color}60`
                      }}
                    />
                  </div>

                  {/* Trait Pills */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {dim.info.coreTraits.slice(0, 4).map((trait, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/5 text-slate-300"
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
      </div>

      {/* Comprehensive Career & Field Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Recommended Careers */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/15">
          <div className="flex items-center gap-2.5 text-cyan-300 font-bold text-sm mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-cyan-400" />
            </div>
            <span>Rekomendasi Karir Utama ({result.primaryDimension.nameId})</span>
          </div>

          <div className="space-y-2">
            {result.primaryDimension.sampleCareers.map((career, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs sm:text-sm text-slate-200"
              >
                <span>{career}</span>
                <span className="text-[10px] font-semibold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  Kecocokan Tinggi
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Alternatif dari Dimensi Sekunder ({result.secondaryDimension.nameId}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.secondaryDimension.sampleCareers.map((sc, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300"
                >
                  {sc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended College Majors & Work Environment */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-indigo-300 font-bold text-sm mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
              </div>
              <span>Program Studi / Jurusan Kuliah</span>
            </div>

            <div className="space-y-2 mb-4">
              {result.primaryDimension.recommendedMajors.map((major, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-2 text-xs sm:text-sm text-slate-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>{major}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Work Environment */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Lingkungan Kerja yang Ideal</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.primaryDimension.workEnvironment}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Share Card Preview & Direct Download */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Kartu Hasil Visual RIASEC</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pratinjau kartu estetis siap unduh atau bagikan ke media sosial
            </p>
          </div>
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="px-4 py-2 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-400/40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-cyan-300" />
            <span>Simpan Gambar</span>
          </button>
        </div>

        <div className="my-3">
          <CaptureCard result={result} isOffscreen={false} />
        </div>
      </div>

      {/* Career Development Insights */}
      <div className="glass-panel p-6 rounded-3xl border border-white/15 mb-6">
        <div className="flex items-center gap-2 text-pink-300 font-bold text-sm mb-3">
          <Lightbulb className="w-4 h-4 text-pink-400" />
          <span>Tips Pengembangan Diri Berdasarkan Holland Code ({result.topCode})</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <strong className="text-white block mb-1">1. Optimalkan Kekuatan Primer</strong>
            Fokuskan 70% energi Anda pada peran yang menuntut keahlian dimensi{' '}
            <strong className="text-indigo-300">{result.primaryDimension.nameId}</strong> agar Anda cepat mencapai keunggulan kompetitif.
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <strong className="text-white block mb-1">2. Sinergikan Tipe Sekunder</strong>
            Gunakan dimensi{' '}
            <strong className="text-cyan-300">{result.secondaryDimension.nameId}</strong> sebagai nilai pembeda (unique differentiator) yang membuat Anda unik dibanding praktisi sejenis.
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <strong className="text-white block mb-1">3. Kolaborasi untuk Menutup Celah</strong>
            Untuk aktivitas yang memerlukan dimensi bernilai terendah, jalin kemitraan dengan rekan yang memiliki kekuatan komplementer di sisi tersebut.
          </div>
        </div>
      </div>
    </div>
  );
};
