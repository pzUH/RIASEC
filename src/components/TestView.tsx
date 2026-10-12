import React, { useState } from 'react';
import { RIASEC_QUESTIONS, LIKERT_OPTIONS, RIASEC_DIMENSIONS } from '../data/riasecData';
import { LikertValue } from '../types/riasec';
import { ChevronLeft, ChevronRight, Check, X, Sparkles, Loader2 } from 'lucide-react';

interface TestViewProps {
  userName: string;
  userAge: number;
  onFinish: (answers: Record<number, LikertValue>) => void;
  onCancel: () => void;
}

export const TestView: React.FC<TestViewProps> = ({
  userName: _userName,
  userAge: _userAge,
  onFinish,
  onCancel
}) => {
  const totalQuestions = RIASEC_QUESTIONS.length;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, LikertValue>>({});
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  // Safe bounds check to guarantee currentQuestion is never undefined
  const safeIndex = Math.max(0, Math.min(currentIndex, totalQuestions - 1));
  const currentQuestion = RIASEC_QUESTIONS[safeIndex] || RIASEC_QUESTIONS[0];
  const dimensionInfo = RIASEC_DIMENSIONS[currentQuestion?.dimension] || RIASEC_DIMENSIONS.R;

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (value: LikertValue) => {
    if (isFinishing || !currentQuestion) return;

    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);

    const isAllNowAnswered = Object.keys(updated).length === totalQuestions;

    // Otomatis langsung lanjut ke hasil saat soal terakhir selesai diisi
    if (isAllNowAnswered) {
      setIsFinishing(true);
      setTimeout(() => {
        onFinish(updated);
      }, 280);
      return;
    }

    // Auto-advance ke soal berikutnya dengan batasan ketat agar index tidak melebihi batas
    if (autoAdvance) {
      if (safeIndex < totalQuestions - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
        }, 160);
      } else {
        // Jika di soal terakhir tapi ada soal yang terlewat, loncat ke soal pertama yang kosong
        const firstMissing = RIASEC_QUESTIONS.findIndex(q => updated[q.id] === undefined);
        if (firstMissing !== -1) {
          setTimeout(() => {
            setCurrentIndex(Math.max(0, Math.min(firstMissing, totalQuestions - 1)));
          }, 160);
        }
      }
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const allAnswered = answeredCount === totalQuestions;

  const handleSubmit = () => {
    if (!allAnswered) {
      const firstUnansweredIndex = RIASEC_QUESTIONS.findIndex(q => answers[q.id] === undefined);
      if (firstUnansweredIndex !== -1) {
        setCurrentIndex(firstUnansweredIndex);
        return;
      }
    }
    setIsFinishing(true);
    setTimeout(() => {
      onFinish(answers);
    }, 200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[calc(100dvh-58px)] px-3 sm:px-4 py-2 sm:py-3 flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Header Ringkas (Progress Bar + Info) */}
      <div className="glass-panel px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border border-white/15 shrink-0">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">
              Soal <strong className="text-white font-extrabold">{safeIndex + 1}</strong> / {totalQuestions}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[11px] text-cyan-300 font-medium">
              {progressPercent}% Selesai
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-400 hover:text-slate-200">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="rounded bg-slate-800 border-white/20 text-indigo-500 w-3 h-3"
              />
              <span className="hidden sm:inline">Auto-lanjut</span>
            </label>

            <button
              onClick={() => {
                if (answeredCount > 0) {
                  if (window.confirm('Keluar dari tes dan kembali ke beranda?')) {
                    onCancel();
                  }
                } else {
                  onCancel();
                }
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Batalkan tes"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="w-full bg-slate-900/90 rounded-full h-1.5 overflow-hidden border border-white/10">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${(answeredCount / totalQuestions) * 100}%`,
              background: 'linear-gradient(90deg, #06b6d4 0%, #6366f1 50%, #ec4899 100%)'
            }}
          />
        </div>
      </div>

      {/* 2. Loading Finish Overlay */}
      {isFinishing && (
        <div className="my-2 py-2.5 px-4 rounded-xl bg-indigo-950/60 border border-indigo-400/40 text-center animate-pulse flex items-center justify-center gap-2 shrink-0">
          <Loader2 className="w-4 h-4 text-cyan-300 animate-spin" />
          <span className="text-xs font-bold text-white">
            Semua butir soal terjawab! Mengalkulasi profil Holland Anda...
          </span>
        </div>
      )}

      {/* 3. Main Question Card (Non-scrollable, fits perfectly on screen) */}
      <div className="glass-panel p-4 sm:p-6 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden flex-1 my-2 flex flex-col justify-between min-h-0">
        {/* Subtle background dimension ambient glow */}
        <div
          className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: dimensionInfo?.color || '#6366f1' }}
        />

        {/* Dimension Badge & Number */}
        <div className="flex items-center justify-between mb-2 shrink-0">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-sm"
            style={{
              backgroundColor: `${dimensionInfo?.color || '#6366f1'}20`,
              borderColor: `${dimensionInfo?.color || '#6366f1'}50`,
              color: '#ffffff'
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: dimensionInfo?.color || '#6366f1' }}
            />
            <span>Dimensi {dimensionInfo?.code || 'R'}: {dimensionInfo?.nameId || 'Realistis'}</span>
          </div>

          <span className="text-[11px] font-semibold text-slate-400">
            {answeredCount} dari {totalQuestions} terisi
          </span>
        </div>

        {/* Statement Typography */}
        <div className="my-auto py-1 shrink-0">
          <h2 className="text-base sm:text-xl font-bold text-white leading-snug sm:leading-relaxed tracking-tight">
            "{currentQuestion?.statement || ''}"
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 sm:mt-1.5 leading-relaxed line-clamp-2">
            {currentQuestion?.subtext || ''}
          </p>
        </div>

        {/* 4 Likert Scale Choice Buttons (Vertically compact to guarantee zero scroll) */}
        <div className="space-y-2 sm:space-y-2.5 shrink-0 my-1">
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = currentQuestion ? answers[currentQuestion.id] === opt.value : false;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelectOption(opt.value)}
                className={`w-full py-2.5 px-3 sm:py-3 sm:px-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-150 flex items-center justify-between group active:scale-[0.99] ${
                  isSelected
                    ? 'bg-indigo-600/35 border-cyan-400 text-white shadow-md shadow-indigo-500/20 ring-1 ring-cyan-400'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06] text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                      isSelected
                        ? 'bg-cyan-400 border-white text-slate-950 font-black'
                        : 'border-white/25 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold tracking-tight text-white leading-tight">
                      {opt.label}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {opt.enLabel}
                    </div>
                  </div>
                </div>

                <div
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {opt.scoreText}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Controls: Prev / Next */}
      <div className="glass-panel px-3 py-2 rounded-2xl border border-white/15 flex items-center justify-between gap-3 shrink-0">
        <button
          onClick={handlePrev}
          disabled={safeIndex === 0}
          className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            safeIndex === 0
              ? 'opacity-25 border-transparent cursor-not-allowed text-slate-500'
              : 'border-white/15 text-slate-200 hover:bg-white/10'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>

        <span className="text-[11px] text-slate-400 font-medium">
          {safeIndex + 1} / {totalQuestions}
        </span>

        {safeIndex < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
          >
            <span>Berikutnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              allAnswered
                ? 'glass-button-primary text-white animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Lihat Hasil</span>
          </button>
        )}
      </div>
    </div>
  );
};
