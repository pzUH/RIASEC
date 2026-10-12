import React from 'react';
import { AssessmentResult } from '../types/riasec';
import { getCombinedCodeSummary } from '../utils/riasecCalculator';
import { Compass, Sparkles, Award } from 'lucide-react';

interface CaptureCardProps {
  result: AssessmentResult;
  isOffscreen?: boolean;
}

export const CaptureCard = React.forwardRef<HTMLDivElement, CaptureCardProps>(
  ({ result, isOffscreen = false }, ref) => {
    const summary = getCombinedCodeSummary(result.topCode);
    const dateStr = new Date(result.timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    return (
      <div
        ref={ref}
        id="capture-card"
        className={`relative w-full max-w-[540px] mx-auto rounded-3xl overflow-hidden p-6 sm:p-8 text-white ${
          isOffscreen ? 'fixed left-[-9999px] top-[-9999px] z-[-100]' : ''
        }`}
        style={{
          background: 'linear-gradient(145deg, #0d1322 0%, #111a2e 50%, #090e1a 100%)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.12) inset',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
        }}
      >
        {/* Glow Ambient Blobs */}
        <div
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-40 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full opacity-30 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }}
        />

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900/80 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-cyan-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> RIASEC EXPLORER
              </div>
              <div className="text-slate-400 text-[11px]">Holland Career Assessment</div>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-300">
              <Award className="w-3 h-3 text-amber-400" /> Hasil Resmi
            </div>
            <div className="text-[10px] text-slate-400 mt-1">{dateStr}</div>
          </div>
        </div>

        {/* User Info & Holland Code Badge */}
        <div className="relative z-10 mb-6">
          <div className="text-xs font-medium text-slate-400">Profil Peserta</div>
          <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center justify-between">
            <span>{result.userName}</span>
            <span className="text-sm font-normal text-slate-400">{result.userAge} Th</span>
          </div>

          {/* Holland Code Big Box */}
          <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/15 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                  3 Kode Holland Utama
                </span>
                <div className="text-4xl sm:text-5xl font-black tracking-widest bg-gradient-to-r from-cyan-300 via-indigo-300 to-pink-400 bg-clip-text text-transparent mt-0.5">
                  {result.topCode}
                </div>
              </div>
              <div className="flex gap-1.5 self-center">
                {result.topCode.split('').map((letter, i) => {
                  const dim = result.sortedDimensions.find(d => d.dimension === letter)?.info;
                  return (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-md border"
                      style={{
                        backgroundColor: `${dim?.color || '#6366f1'}25`,
                        borderColor: dim?.color || '#6366f1',
                        color: dim?.color || '#fff'
                      }}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-white/10">
              <div className="text-xs font-semibold text-slate-200">{summary.title}</div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                {summary.narrative}
              </p>
            </div>
          </div>
        </div>

        {/* 6 RIASEC Dimension Scores Grid */}
        <div className="relative z-10 mb-6">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Komposisi Skor 6 Dimensi Holland
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {result.sortedDimensions.map((dim) => (
              <div
                key={dim.dimension}
                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: dim.info.color }}
                    />
                    <span className="text-white">{dim.info.code}</span>
                    <span className="text-slate-400 text-[11px] font-normal truncate max-w-[80px]">
                      {dim.info.nameId}
                    </span>
                  </span>
                  <span className="text-xs font-extrabold" style={{ color: dim.info.color }}>
                    {dim.score}/12
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${dim.percentage}%`,
                      backgroundColor: dim.info.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Career Highlights */}
        <div className="relative z-10 mb-4 p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
          <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1.5">
            Rekomendasi Karir Utama ({result.primaryDimension.nameId})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {result.primaryDimension.sampleCareers.slice(0, 4).map((career, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-200"
              >
                {career}
              </span>
            ))}
          </div>
        </div>

        {/* Footer branding */}
        <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/10 pt-3">
          <span>Model Tipologi John Holland • RIASEC</span>
          <span className="font-semibold text-slate-300">riasec-explorer.app</span>
        </div>
      </div>
    );
  }
);

CaptureCard.displayName = 'CaptureCard';
