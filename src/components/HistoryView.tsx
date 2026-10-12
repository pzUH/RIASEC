import React from 'react';
import { AssessmentResult } from '../types/riasec';
import { exportToExcel } from '../utils/exportUtils';
import {
  Clock,
  Trash2,
  FileSpreadsheet,
  ChevronRight,
  Compass,
  User,
  Calendar
} from 'lucide-react';

interface HistoryViewProps {
  history: AssessmentResult[];
  onSelectResult: (result: AssessmentResult) => void;
  onClearHistory: () => void;
  onStartNewTest: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onStartNewTest,
  onShowToast
}) => {
  const handleExport = (e: React.MouseEvent, res: AssessmentResult) => {
    e.stopPropagation();
    try {
      exportToExcel(res);
      onShowToast('success', `Laporan Excel untuk ${res.userName} berhasil diunduh!`);
    } catch {
      onShowToast('error', 'Gagal membuat file Excel.');
    }
  };

  if (history.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-12 text-center pb-32">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/15">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Belum Ada Riwayat Tes</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
            Anda belum pernah menyelesaikan asesmen di peramban ini. Mulai tes 12 butir pertanyaan singkat untuk melihat kode kepribadian Holland Anda.
          </p>
          <button
            onClick={onStartNewTest}
            className="px-6 py-3 rounded-xl glass-button-primary text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg"
          >
            <Compass className="w-4 h-4 text-cyan-300" />
            <span>Mulai Tes Pertama Anda</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-8 pb-32">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Riwayat Asesmen RIASEC
          </h1>
          <p className="text-xs text-slate-400">
            Daftar hasil tes yang tersimpan di penyimpanan lokal perangkat ini
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Hapus seluruh riwayat tes dari perangkat ini?')) {
              onClearHistory();
              onShowToast('info', 'Riwayat tersimpan telah dibersihkan.');
            }
          }}
          className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus Riwayat</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {history.map((item) => {
          const formattedDate = new Date(item.timestamp).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div
              key={item.id}
              onClick={() => onSelectResult(item)}
              className="glass-card glass-card-interactive p-4 sm:p-5 rounded-2xl border border-white/10 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3.5">
                {/* Big Code Pill */}
                <div className="px-3.5 py-2 rounded-xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-400/30 flex flex-col items-center justify-center min-w-[70px]">
                  <span className="text-[10px] uppercase font-bold text-indigo-300">
                    Kode
                  </span>
                  <span className="text-lg font-black tracking-widest text-white">
                    {item.topCode}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.userName}</span>
                    <span className="text-xs text-slate-400 font-normal">
                      ({item.userAge} th)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{formattedDate}</span>
                  </div>

                  {/* Mini score indicators */}
                  <div className="flex items-center gap-2 mt-2">
                    {item.sortedDimensions.slice(0, 3).map((sd) => (
                      <span
                        key={sd.dimension}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300"
                      >
                        {sd.dimension}: {sd.score}/6
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={(e) => handleExport(e, item)}
                  className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  title="Unduh Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Excel</span>
                </button>

                <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white flex items-center">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
