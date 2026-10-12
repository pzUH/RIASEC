import React, { useState } from 'react';
import { RIASEC_QUESTIONS, LIKERT_OPTIONS, RIASEC_DIMENSIONS } from '../data/riasecData';
import { LikertValue } from '../types/riasec';
import { ChevronLeft, ChevronRight, CheckCircle2, Check, ArrowRight, X } from 'lucide-react';

interface TestViewProps {
  userName: string;
  userAge: number;
  onFinish: (answers: Record<number, LikertValue>) => void;
  onCancel: () => void;
}

export const TestView: React.FC<TestViewProps> = ({
  userName,
  userAge: _userAge,
  onFinish,
  onCancel
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, LikertValue>>({});
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  const currentQuestion = RIASEC_QUESTIONS[currentIndex];
  const dimensionInfo = RIASEC_DIMENSIONS[currentQuestion.dimension];

  const totalQuestions = RIASEC_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const handleSelectOption = (value: LikertValue) => {
    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);

    if (autoAdvance) {
      if (currentIndex < totalQuestions - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
        }, 180);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const isCurrentAnswered = answers[currentQuestion.id] !== undefined;
  const allAnswered = answeredCount === totalQuestions;

  const handleSubmit = () => {
    if (!allAnswered) {
      // Find first unanswered question
      const firstUnansweredIndex = RIASEC_QUESTIONS.findIndex(q => answers[q.id] === undefined);
      if (firstUnansweredIndex !== -1) {
        setCurrentIndex(firstUnansweredIndex);
        return;
      }
    }
    onFinish(answers);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 pb-28">
      {/* Top Header Card with Dynamic Progress Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/15 mb-5 relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">
              Pertanyaan <span className="text-white font-extrabold">{currentIndex + 1}</span> dari {totalQuestions}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-indigo-300 font-medium">
              {answeredCount} terjawab ({progressPercent}%)
            </span>
          </div>

          <button
            onClick={() => {
              if (answeredCount > 0) {
                if (window.confirm('Batalkan tes dan kembali ke beranda? Jawaban Anda tidak akan disimpan.')) {
                  onCancel();
                }
              } else {
                onCancel();
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Keluar dari tes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time Glowing Progress Bar */}
        <div className="w-full bg-slate-900/80 rounded-full h-2.5 p-0.5 border border-white/10 relative overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${(answeredCount / totalQuestions) * 100}%`,
              background: 'linear-gradient(90deg, #06b6d4 0%, #6366f1 50%, #ec4899 100%)',
              boxShadow: '0 0 12px rgba(99, 102, 241, 0.7)'
            }}
          />
        </div>

        {/* User badge & Auto advance toggle */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/5 text-[11px] text-slate-400">
          <span className="truncate max-w-[180px]">
            Peserta: <strong className="text-slate-200">{userName}</strong>
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer select-none hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
              className="rounded bg-slate-800 border-white/20 text-indigo-500 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Auto-lanjut</span>
          </label>
        </div>
      </div>

      {/* Main Question Card with Glassmorphism */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden transition-all duration-300">
        {/* Subtle background dimension ambient glow */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-500"
          style={{ backgroundColor: dimensionInfo.color }}
        />

        {/* Dimension indicator badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border shadow-sm"
            style={{
              backgroundColor: `${dimensionInfo.color}20`,
              borderColor: `${dimensionInfo.color}60`,
              color: '#ffffff'
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: dimensionInfo.color }}
            />
            <span>Tipe {dimensionInfo.code}: {dimensionInfo.nameId} ({dimensionInfo.nameEn})</span>
          </div>

          <span className="text-[11px] font-medium text-slate-400">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Statement typography */}
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed tracking-tight">
            "{currentQuestion.statement}"
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            {currentQuestion.subtext}
          </p>
        </div>

        {/* 4 Likert Scale Choice Buttons */}
        <div className="space-y-2.5 sm:space-y-3">
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = answers[currentQuestion.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelectOption(opt.value)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-400/30'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06] text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-indigo-500 border-white text-white'
                        : 'border-white/20 group-hover:border-white/40 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-tight text-white">
                      {opt.label}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {opt.enLabel}
                    </div>
                  </div>
                </div>

                <div
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                    isSelected
                      ? 'bg-indigo-500/30 border-indigo-400/40 text-indigo-200'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  {opt.scoreText}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Actions (Prev / Next) */}
        <div className="flex items-center justify-between gap-3 mt-8 pt-5 border-t border-white/10">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              currentIndex === 0
                ? 'opacity-30 border-transparent cursor-not-allowed text-slate-500'
                : 'border-white/15 text-slate-200 hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Sebelumnya</span>
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                allAnswered
                  ? 'glass-button-primary text-white animate-pulse'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <span>{allAnswered ? 'Lihat Hasil Asesmen' : 'Selesaikan Semua Soal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question Number Pills Navigation */}
      <div className="mt-5 glass-card p-3.5 rounded-2xl border border-white/10">
        <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
          <span>Navigasi Butir Soal</span>
          <span className="text-[10px] text-slate-400">
            {allAnswered ? 'Semua terjawab' : `${totalQuestions - answeredCount} belum terjawab`}
          </span>
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {RIASEC_QUESTIONS.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'ring-2 ring-white border-white bg-indigo-500 text-white'
                    : isAnswered
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10'
                }`}
                title={`Soal ${q.id} (${q.dimension})`}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Complete CTA if all answered and not on last question */}
      {allAnswered && currentIndex < totalQuestions - 1 && (
        <div className="mt-4 text-center animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={handleSubmit}
            className="w-full py-3 px-6 rounded-2xl glass-button-primary font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-300" />
            <span>Semua {totalQuestions} Soal Telah Diisi — Analisis Hasil Sekarang</span>
          </button>
        </div>
      )}
    </div>
  );
};
