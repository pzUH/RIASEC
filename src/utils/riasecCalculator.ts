import { RIASEC_DIMENSIONS, RIASEC_QUESTIONS } from '../data/riasecData';
import { AssessmentResult, LikertValue, RiasecDimension } from '../types/riasec';

const STORAGE_LAST_RESULT_KEY = 'riasec_last_result';
const STORAGE_HISTORY_KEY = 'riasec_history';

export function calculateRiasecResult(
  userName: string,
  userAge: number,
  answers: Record<number, LikertValue>
): AssessmentResult {
  const scores: Record<RiasecDimension, number> = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0
  };

  // 4 questions per dimension, max possible score = 4 * 3 = 12
  const maxPossibleScorePerDimension = 12;

  RIASEC_QUESTIONS.forEach((q) => {
    const val = answers[q.id] ?? 0;
    scores[q.dimension] += val;
  });

  const percentages: Record<RiasecDimension, number> = {
    R: Math.round((scores.R / maxPossibleScorePerDimension) * 100),
    I: Math.round((scores.I / maxPossibleScorePerDimension) * 100),
    A: Math.round((scores.A / maxPossibleScorePerDimension) * 100),
    S: Math.round((scores.S / maxPossibleScorePerDimension) * 100),
    E: Math.round((scores.E / maxPossibleScorePerDimension) * 100),
    C: Math.round((scores.C / maxPossibleScorePerDimension) * 100)
  };

  // Sort dimensions by score descending
  const sorted = (['R', 'I', 'A', 'S', 'E', 'C'] as RiasecDimension[])
    .map((dim) => ({
      dimension: dim,
      score: scores[dim],
      percentage: percentages[dim],
      info: RIASEC_DIMENSIONS[dim]
    }))
    .sort((a, b) => b.score - a.score);

  const topCode = sorted.slice(0, 3).map((item) => item.dimension).join('');

  const result: AssessmentResult = {
    id: `riasec_${Date.now()}`,
    userName: userName.trim() || 'Peserta',
    userAge: userAge || 20,
    timestamp: new Date().toISOString(),
    scores,
    maxPossibleScorePerDimension,
    percentages,
    sortedDimensions: sorted,
    topCode,
    primaryDimension: sorted[0].info,
    secondaryDimension: sorted[1].info,
    tertiaryDimension: sorted[2].info,
    answers
  };

  return result;
}

export function saveResultToStorage(result: AssessmentResult): void {
  try {
    // Save last result
    localStorage.setItem(STORAGE_LAST_RESULT_KEY, JSON.stringify(result));

    // Also append to history list (max 10 recent attempts)
    const historyJson = localStorage.getItem(STORAGE_HISTORY_KEY);
    let history: AssessmentResult[] = [];
    if (historyJson) {
      try {
        history = JSON.parse(historyJson);
      } catch {
        history = [];
      }
    }
    const updated = [result, ...history.filter(h => h.id !== result.id)].slice(0, 10);
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save assessment to localStorage', err);
  }
}

export function getLastResultFromStorage(): AssessmentResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_LAST_RESULT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AssessmentResult;
  } catch (err) {
    console.error('Failed to read last result from localStorage', err);
    return null;
  }
}

export function getHistoryFromStorage(): AssessmentResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AssessmentResult[];
  } catch (err) {
    console.error('Failed to read history from localStorage', err);
    return [];
  }
}

export function clearHistoryFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_LAST_RESULT_KEY);
    localStorage.removeItem(STORAGE_HISTORY_KEY);
  } catch (err) {
    console.error('Failed to clear storage', err);
  }
}

export function deleteResultFromStorage(id: string): void {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    if (raw) {
      const history = JSON.parse(raw) as AssessmentResult[];
      const updated = history.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
    }
    const last = getLastResultFromStorage();
    if (last && last.id === id) {
      localStorage.removeItem(STORAGE_LAST_RESULT_KEY);
    }
  } catch (err) {
    console.error('Failed to delete item from storage', err);
  }
}

export function getCombinedCodeSummary(code: string): { title: string; narrative: string } {
  const codeMap: Record<string, { title: string; narrative: string }> = {
    RIA: {
      title: 'Inovator Teknologi Praktis & Peneliti Kreatif',
      narrative: 'Anda memadukan kecakapan teknis mekanik (R), daya analisis riset ilmiah (I), dan imajinasi orisinal (A). Cocok untuk merancang arsitektur baru, pengembangan robotik, atau desain teknologi mutakhir.'
    },
    RIS: {
      title: 'Pakar Sains Terapan & Pelayanan Teknis',
      narrative: 'Kombinasi kemampuan praktis (R), ketajaman logika riset (I), dan kepedulian sosial (S). Ideal untuk profesi bidang kedokteran, fisioterapi, penyuluhan teknologi agrikultur, atau edukasi sains.'
    },
    RIE: {
      title: 'Pelopor Produk Teknologi & Pengusaha Keteknikan',
      narrative: 'Memadukan keahlian teknik nyata (R), analisis mendalam (I), dan dorongan bisnis persuasif (E). Sangat ideal untuk mendirikan tech startup, project manager engineering, atau konsultan teknikal.'
    },
    RIC: {
      title: 'Spesialis Sistem Komputasi & Kontrol Kualitas',
      narrative: 'Memadukan keterampilan mekanik/hardware (R), pemecahan masalah algoritma (I), dan kepatuhan sistematis (C). Sangat cocok untuk DevOps, spesialis keamanan siber, atau teknisi instrumentasi.'
    },
    IAS: {
      title: 'Ilmuwan Humaniora & Edukator Riset',
      narrative: 'Kombinasi analisis tajam (I), kreativitas ide (A), dan empati sosial (S). Sangat tepat sebagai psikolog peneliti, dosen universitas, antropolog, atau perancang kurikulum pendidikan inovatif.'
    },
    IAE: {
      title: 'Konseptor Strategis & Inovator Solusi Digital',
      narrative: 'Memadukan investigasi data (I), estetika kreatif (A), dan ambisi bisnis (E). Cocok untuk Product Manager, konsultan strategi inovasi produk, atau direktur riset kreatif.'
    },
    SEC: {
      title: 'Fasilitator Organisasi & Manajer Kesejahteraan',
      narrative: 'Kombinasi kepedulian terhadap manusia (S), kepemimpinan bisnis (E), dan tata kelola teratur (C). Sangat cocok untuk praktisi HRD, manajer operasional rumah sakit, atau pimpinan yayasan sosial.'
    },
    SAE: {
      title: 'Komunikator Publik & Penggerak Komunitas Kreatif',
      narrative: 'Memadukan empati sosial (S), ekspresi artistik (A), dan karisma kepemimpinan (E). Ideal untuk PR (Public Relations), campaign manager sosial, konten kreator advokasi, atau fasilitator pelatihan.'
    },
    ESC: {
      title: 'Eksekutif Bisnis & Pengelola Korporasi',
      narrative: 'Kombinasi ambisi kewirausahaan (E), keterampilan relasi manusia (S), dan ketertiban sistem manajemen (C). Sangat handal sebagai eksekutif operasional, manajer cabang perbankan, atau direktur pemasaran.'
    },
    ECI: {
      title: 'Analis Finansial & Pengambil Keputusan Terukur',
      narrative: 'Memadukan inisiatif bisnis (E), keteraturan akuntansi/data (C), dan penyelidikan analitis (I). Sangat kuat di perbankan investasi, aktuaria, atau audit kepatuhan korporasi besar.'
    }
  };

  if (codeMap[code]) {
    return codeMap[code];
  }

  // Fallback programmatic synthesizer
  const d1 = RIASEC_DIMENSIONS[code[0] as RiasecDimension];
  const d2 = RIASEC_DIMENSIONS[code[1] as RiasecDimension];
  const d3 = RIASEC_DIMENSIONS[code[2] as RiasecDimension];

  return {
    title: `Profil Harmoni ${d1?.nameId || ''} - ${d2?.nameId || ''} - ${d3?.nameId || ''}`,
    narrative: `Kepribadian karir Anda didominasi oleh orientasi ${d1?.archetypeId || ''}, diperkuat oleh kapabilitas ${d2?.archetypeId || ''}, serta dilengkapi oleh pendekatan ${d3?.archetypeId || ''}. Karir terbaik Anda adalah yang memberikan ruang untuk mensinergikan ketiga aspek ini secara berimbang.`
  };
}
