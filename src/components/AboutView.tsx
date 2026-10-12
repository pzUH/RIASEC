import React from 'react';
import { RIASEC_DIMENSIONS, HOLLAND_HEXAGON_ORDER } from '../data/riasecData';
import {
  BookOpen,
  Award,
  Compass,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface AboutViewProps {
  onStartTest: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartTest }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 sm:py-8 pb-32">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Landasan Teori Ilmiah</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Teori Tipologi Karir John L. Holland
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed max-w-3xl">
            Dikembangkan oleh psikolog terkemuka <strong>Dr. John Lewis Holland</strong> (1919–2008), model RIASEC merupakan salah satu kerangka psikometri vokasional yang paling banyak divalidasi dan digunakan di seluruh dunia, termasuk oleh sistem klasifikasi kerja resmi seperti <em>O*NET</em> di Amerika Serikat.
          </p>
        </div>
      </div>

      {/* Hexagonal Congruency Concept */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 mb-8">
        <div className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-white mb-3">
          <Compass className="w-5 h-5 text-indigo-400" />
          <span>Prinsip Keselarasan Model Hexagon (The Hexagonal Model)</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          Holland merancang keenam tipe dalam bentuk <strong>heksagon (segi enam)</strong> berurutan: <strong className="text-rose-400">R</strong> - <strong className="text-cyan-400">I</strong> - <strong className="text-pink-400">A</strong> - <strong className="text-emerald-400">S</strong> - <strong className="text-amber-400">E</strong> - <strong className="text-purple-400">C</strong>. Jarak antar tipe pada heksagon mencerminkan kedekatan psikologis:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Tipe Bersebelahan (Adjacent)</span>
            </div>
            <div className="text-xs text-white font-semibold mb-1">
              Konsistensi & Keselarasan Tinggi
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tipe yang letaknya bertetangga (misal R & I, atau S & E) memiliki banyak kesamaan minat psikologis dan mudah dipadukan dalam satu profesi kerja.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Tipe Berselang 1 Titik (Alternate)</span>
            </div>
            <div className="text-xs text-white font-semibold mb-1">
              Konsistensi Moderat
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tipe yang berjarak satu sudut (misal R & A, atau I & S) memiliki irisan minat menengah. Sering melahirkan profil karir multidisipliner yang menarik.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="text-xs font-bold text-rose-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-rose-400" />
              <span>Tipe Berhadapan (Opposite)</span>
            </div>
            <div className="text-xs text-white font-semibold mb-1">
              Paling Berbeda (Kontras)
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tipe yang berseberangan secara diagonal (R vs S, I vs E, A vs C) memiliki preferensi berlawanan. Jika Anda tinggi di keduanya, Anda adalah jembatan langka.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Dimensions Deep-Dive */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Eksplorasi Mendalam 6 Dimensi Holland
        </h2>

        {HOLLAND_HEXAGON_ORDER.map((code) => {
          const dim = RIASEC_DIMENSIONS[code];
          return (
            <div
              key={code}
              className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 transition-all hover:border-white/20"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shadow-md border"
                    style={{
                      backgroundColor: `${dim.color}25`,
                      borderColor: dim.color,
                      color: dim.color
                    }}
                  >
                    {dim.code}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {dim.nameId} ({dim.nameEn})
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {dim.archetypeId}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {dim.coreTraits.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/5 text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
                {dim.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs">
                <div>
                  <span className="font-semibold text-slate-400 block mb-1">
                    Contoh Jalur Karir:
                  </span>
                  <div className="text-slate-200">
                    {dim.sampleCareers.join(', ')}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block mb-1">
                    Lingkungan Kerja Karakteristik:
                  </span>
                  <div className="text-slate-300 italic">
                    "{dim.workEnvironment}"
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frequently Asked Questions */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 mb-8">
        <div className="flex items-center gap-2 text-base font-bold text-white mb-4">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>Pertanyaan Umum (FAQ)</span>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <h4 className="font-bold text-white mb-1.5">
              1. Apakah hasil tes Holland RIASEC ini bersifat permanen?
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Meskipun preferensi dasar kepribadian relatif stabil, minat vokasional seseorang dapat berkembang seiring pengalaman hidup, edukasi baru, dan paparan industri kerja yang berbeda. Anda disarankan melakukan asesmen ulang secara berkala setiap 1-2 tahun.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <h4 className="font-bold text-white mb-1.5">
              2. Bagaimana cara membaca Tiga Kode Holland (misal: RIA)?
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              Huruf pertama adalah <strong>Dimensi Primer</strong> (pengarah arah karir terbesar). Huruf kedua adalah <strong>Dimensi Sekunder</strong> (keterampilan pendukung yang melengkapi kepribadian). Huruf ketiga adalah <strong>Dimensi Tersier</strong> (penyeimbang konteks).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <h4 className="font-bold text-white mb-1.5">
              3. Apakah data saya aman dan tidak disebarluaskan?
            </h4>
            <p className="text-slate-400 leading-relaxed text-xs">
              RIASEC Explorer dirancang dengan arsitektur murni client-side. Seluruh data nama, umur, dan jawaban disimpan secara eksklusif di memori peramban lokal (localStorage) perangkat Anda dan tidak dikirimkan ke server backend manapun.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <button
          onClick={onStartTest}
          className="px-8 py-3.5 rounded-2xl glass-button-primary font-bold text-sm text-white inline-flex items-center gap-2 shadow-xl"
        >
          <Award className="w-4 h-4 text-cyan-300" />
          <span>Ambil Tes Karir RIASEC Sekarang</span>
        </button>
      </div>
    </div>
  );
};
