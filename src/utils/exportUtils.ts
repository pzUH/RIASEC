import * as XLSX from 'xlsx';
import { AssessmentResult, RiasecDimension } from '../types/riasec';
import { RIASEC_QUESTIONS } from '../data/riasecData';
import { getCombinedCodeSummary } from './riasecCalculator';

/**
 * Generate a high-resolution, beautifully styled PNG Blob of the assessment card
 * using pure HTML5 Canvas 2D API for 100% cross-platform reliability without CSS bugs.
 */
export async function generateCardImageBlob(result: AssessmentResult): Promise<Blob> {
  const width = 1080;
  const height = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context tidak didukung di perangkat ini.');
  }

  const summary = getCombinedCodeSummary(result.topCode);

  // 1. Background deep gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090D16');
  bgGrad.addColorStop(0.5, '#0F172A');
  bgGrad.addColorStop(1, '#080C14');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ambient glowing orbs
  const drawGlow = (cx: number, cy: number, r: number, color: string) => {
    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    radGrad.addColorStop(0, color);
    radGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };
  drawGlow(200, 200, 380, 'rgba(99, 102, 241, 0.22)');
  drawGlow(900, 300, 360, 'rgba(6, 182, 212, 0.20)');
  drawGlow(300, 1100, 420, 'rgba(236, 72, 153, 0.18)');

  // 3. Main Glass Card Border & Background
  const cardX = 60;
  const cardY = 60;
  const cardW = width - 120;
  const cardH = height - 120;
  const radius = 40;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, radius);
  ctx.fillStyle = 'rgba(18, 24, 38, 0.75)';
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.stroke();
  ctx.restore();

  // Helper for rounded rect fill
  const fillRoundRect = (x: number, y: number, w: number, h: number, r: number, fillStyle: string) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();
  };

  // Helper for rounded rect stroke
  const strokeRoundRect = (x: number, y: number, w: number, h: number, r: number, strokeStyle: string, lineWidth = 1.5) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.restore();
  };

  // 4. Header: Logo & Branding
  fillRoundRect(100, 100, 60, 60, 16, '#4f46e5');
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('◈', 116, 142);

  ctx.fillStyle = '#22d3ee';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('RIASEC EXPLORER', 178, 126);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px sans-serif';
  ctx.fillText('Model Tipologi Karir John L. Holland', 178, 152);

  // Date & Badge Right
  const dateStr = new Date(result.timestamp).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  fillRoundRect(800, 105, 170, 42, 21, 'rgba(255,255,255,0.06)');
  strokeRoundRect(800, 105, 170, 42, 21, 'rgba(255,255,255,0.15)');
  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 15px sans-serif';
  ctx.fillText(`✓ Hasil Resmi`, 820, 132);

  ctx.fillStyle = '#64748b';
  ctx.font = '14px sans-serif';
  ctx.fillText(dateStr, 860, 172);

  // Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(100, 185);
  ctx.lineTo(970, 185);
  ctx.stroke();

  // 5. Participant Info
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 15px sans-serif';
  ctx.fillText('PROFIL PESERTA ASESMEN', 100, 222);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px sans-serif';
  const nameText = result.userName.length > 24 ? result.userName.substring(0, 24) + '...' : result.userName;
  ctx.fillText(nameText, 100, 268);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '22px sans-serif';
  ctx.fillText(`${result.userAge} Tahun`, 100 + ctx.measureText(nameText).width + 18, 268);

  // 6. Holland Code Big Box
  const boxY = 300;
  fillRoundRect(100, boxY, 870, 195, 28, 'rgba(255, 255, 255, 0.04)');
  strokeRoundRect(100, boxY, 870, 195, 28, 'rgba(255, 255, 255, 0.14)');

  ctx.fillStyle = '#818cf8';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('3 KODE HOLLAND UTAMA', 130, boxY + 36);

  // Big Gradient Code Text
  const codeGrad = ctx.createLinearGradient(130, boxY + 45, 450, boxY + 110);
  codeGrad.addColorStop(0, '#22d3ee');
  codeGrad.addColorStop(0.5, '#a5b4fc');
  codeGrad.addColorStop(1, '#f472b6');
  ctx.fillStyle = codeGrad;
  ctx.font = '900 78px sans-serif';
  ctx.fillText(result.topCode, 130, boxY + 115);

  // 3 Letter Badges
  result.topCode.split('').forEach((letter, i) => {
    const dim = result.sortedDimensions.find(d => d.dimension === letter)?.info;
    const badgeX = 520 + i * 145;
    const badgeY = boxY + 48;
    fillRoundRect(badgeX, badgeY, 130, 70, 18, 'rgba(15, 23, 42, 0.8)');
    strokeRoundRect(badgeX, badgeY, 130, 70, 18, dim?.color || '#6366f1', 2);

    ctx.fillStyle = dim?.color || '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(letter, badgeX + 16, badgeY + 44);

    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(dim?.nameId || '', badgeX + 48, badgeY + 36);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText(`${result.scores[letter as RiasecDimension]}/12 Poin`, badgeX + 48, badgeY + 54);
  });

  // Archetype title & short narrative
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.moveTo(130, boxY + 138);
  ctx.lineTo(940, boxY + 138);
  ctx.stroke();

  ctx.fillStyle = '#c7d2fe';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText(`★ ${summary.title}`, 130, boxY + 168);

  // 7. All 6 Dimensions Grid (2 columns x 3 rows)
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('KOMPOSISI SKOR 6 DIMENSI RIASEC (24 BUTIR SOAL)', 100, 535);

  const gridStartY = 555;
  const colW = 425;
  const rowH = 88;

  result.sortedDimensions.forEach((dim, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const itemX = 100 + col * (colW + 20);
    const itemY = gridStartY + row * (rowH + 12);

    fillRoundRect(itemX, itemY, colW, rowH, 18, 'rgba(255, 255, 255, 0.03)');
    strokeRoundRect(itemX, itemY, colW, rowH, 18, 'rgba(255, 255, 255, 0.08)');

    // Dimension Circle
    fillRoundRect(itemX + 16, itemY + 16, 40, 40, 12, `${dim.info.color}25`);
    strokeRoundRect(itemX + 16, itemY + 16, 40, 40, 12, dim.info.color, 1.5);
    ctx.fillStyle = dim.info.color;
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(dim.dimension, itemX + 28, itemY + 43);

    // Dimension Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`${dim.info.nameId} (${dim.info.nameEn})`, itemX + 68, itemY + 34);

    // Score Text
    ctx.fillStyle = dim.info.color;
    ctx.font = 'bold 17px sans-serif';
    const scoreStr = `${dim.score} / 12`;
    ctx.fillText(scoreStr, itemX + colW - 80, itemY + 34);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px sans-serif';
    ctx.fillText(`${dim.percentage}%`, itemX + colW - 80, itemY + 54);

    // Progress Bar
    const barX = itemX + 68;
    const barY = itemY + 48;
    const barW = colW - 165;
    fillRoundRect(barX, barY, barW, 9, 4.5, 'rgba(15, 23, 42, 0.9)');
    const fillW = Math.max(8, (dim.percentage / 100) * barW);
    fillRoundRect(barX, barY, fillW, 9, 4.5, dim.info.color);
  });

  // 8. Recommended Careers Highlights Box
  const careerBoxY = 885;
  fillRoundRect(100, careerBoxY, 870, 205, 24, 'rgba(99, 102, 241, 0.08)');
  strokeRoundRect(100, careerBoxY, 870, 205, 24, 'rgba(99, 102, 241, 0.25)');

  ctx.fillStyle = '#a5b4fc';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText(`REKOMENDASI PROFESI UNGGULAN (${result.primaryDimension.nameId.toUpperCase()})`, 130, careerBoxY + 36);

  // Career Pills
  const careers = result.primaryDimension.sampleCareers.slice(0, 6);
  careers.forEach((career, cIdx) => {
    const cCol = cIdx % 2;
    const cRow = Math.floor(cIdx / 2);
    const pX = 130 + cCol * 415;
    const pY = careerBoxY + 55 + cRow * 42;

    fillRoundRect(pX, pY, 395, 34, 10, 'rgba(255, 255, 255, 0.05)');
    strokeRoundRect(pX, pY, 395, 34, 10, 'rgba(255, 255, 255, 0.1)');

    ctx.fillStyle = '#38bdf8';
    ctx.font = '16px sans-serif';
    ctx.fillText('•', pX + 12, pY + 22);

    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 13px sans-serif';
    ctx.fillText(career, pX + 28, pY + 22);
  });

  // 9. Card Footer Watermark
  const footerY = 1130;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.moveTo(100, footerY);
  ctx.lineTo(970, footerY);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.fillText('Model John Holland RIASEC • 24 Pertanyaan Skala Likert', 100, footerY + 36);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('riasec-explorer.app', 835, footerY + 36);

  // Return PNG Blob
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Gagal menghasilkan file gambar canvas.'));
    }, 'image/png', 0.95);
  });
}

/**
 * Trigger download of the result image PNG file
 */
export async function downloadResultImage(result: AssessmentResult): Promise<void> {
  const blob = await generateCardImageBlob(result);
  const cleanName = result.userName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `RIASEC_Card_${cleanName}_${result.topCode}.png`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Share result via Web Share API or fallback to image download & clipboard copy
 */
export async function captureAndShareCard(
  _cardElement: HTMLElement | null,
  result: AssessmentResult
): Promise<{ success: boolean; sharedViaApi: boolean; message: string }> {
  try {
    const blob = await generateCardImageBlob(result);
    const cleanName = result.userName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `RIASEC_Card_${cleanName}_${result.topCode}.png`;
    const summary = getCombinedCodeSummary(result.topCode);

    const shareTitle = `Hasil Asesmen RIASEC: ${result.topCode} (${result.userName})`;
    const shareText = `Halo! Saya telah menyelesaikan tes kepribadian karir Holland di RIASEC Explorer dengan 24 pertanyaan. 3 Kode Holland utama saya: ${result.topCode} - ${summary.title}. Cek potensi karir Anda juga!`;

    const file = new File([blob], filename, { type: 'image/png' });

    // 1. Try native Web Share API with File (Mobile devices supporting file share)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          files: [file]
        });
        return {
          success: true,
          sharedViaApi: true,
          message: 'Berhasil dibagikan melalui menu sistem!'
        };
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return { success: true, sharedViaApi: true, message: 'Menu berbagi ditutup.' };
        }
        // Fall through to text share or download
      }
    }

    // 2. Try native Web Share API with Text/URL (Mobile browsers without file share)
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: window.location.href
        });
        // Also trigger image download so user gets the card image
        await downloadResultImage(result);
        return {
          success: true,
          sharedViaApi: true,
          message: 'Teks dibagikan & kartu PNG otomatis diunduh!'
        };
      } catch (err: any) {
        if (err.name === 'AbortError') {
          return { success: true, sharedViaApi: true, message: 'Menu berbagi ditutup.' };
        }
      }
    }

    // 3. Desktop / Unsupported: Direct PNG Download + Copy to Clipboard
    await downloadResultImage(result);

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      }
    } catch {
      // ignore clipboard error
    }

    return {
      success: true,
      sharedViaApi: false,
      message: 'Kartu PNG berhasil diunduh dan ringkasan disalin ke clipboard!'
    };
  } catch (error: any) {
    console.error('Error during card share:', error);
    // Ultimate fallback: direct download
    try {
      await downloadResultImage(result);
      return {
        success: true,
        sharedViaApi: false,
        message: 'Kartu hasil PNG berhasil diunduh ke perangkat Anda!'
      };
    } catch {
      return {
        success: false,
        sharedViaApi: false,
        message: 'Gagal memproses gambar kartu. Silakan coba kembali.'
      };
    }
  }
}

/**
 * Copy text summary to clipboard
 */
export async function copySummaryToClipboard(result: AssessmentResult): Promise<boolean> {
  const summary = getCombinedCodeSummary(result.topCode);
  const text = `Hasil Asesmen RIASEC Explorer (Holland Model):\n` +
    `Nama: ${result.userName} (${result.userAge} Th)\n` +
    `3 Kode Utama: ${result.topCode} - ${summary.title}\n` +
    `Skor: R=${result.scores.R}/12, I=${result.scores.I}/12, A=${result.scores.A}/12, S=${result.scores.S}/12, E=${result.scores.E}/12, C=${result.scores.C}/12\n` +
    `Karir Unggulan: ${result.primaryDimension.sampleCareers.slice(0, 4).join(', ')}\n` +
    `Cek tes karir Anda di RIASEC Explorer!`;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Export assessment data to Excel (.xlsx) file using SheetJS (for History or admin use)
 */
export function exportToExcel(result: AssessmentResult): void {
  const codeSummary = getCombinedCodeSummary(result.topCode);
  const formattedDate = new Date(result.timestamp).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const rows: (string | number)[][] = [
    ['LAPORAN HASIL ASESMEN KEPRIBADIAN KARIR RIASEC'],
    ['Model Tipologi Karir John L. Holland - RIASEC Explorer (24 Butir Soal)'],
    [''],
    ['INFORMASI PENGGUNA'],
    ['Nama Lengkap', result.userName],
    ['Usia', `${result.userAge} Tahun`],
    ['Waktu Pelaksanaan', formattedDate],
    ['Tiga Kode Holland Utama', result.topCode],
    ['Interpretasi Profil', codeSummary.title],
    ['Deskripsi Harmoni', codeSummary.narrative],
    [''],
    ['TABEL PEROLEHAN SKOR RIASEC'],
    ['Kode', 'Tipe Dimensi', 'Arketipe Holland', 'Skor Diperoleh', 'Skor Maksimal', 'Persentase (%)', 'Status Dominasi']
  ];

  result.sortedDimensions.forEach((dim, idx) => {
    let status = 'Rendah';
    if (idx < 3) status = idx === 0 ? 'Sangat Dominan (Primer)' : idx === 1 ? 'Dominan (Sekunder)' : 'Pendukung (Tersier)';
    else if (dim.score >= 6) status = 'Moderat';

    rows.push([
      dim.dimension,
      dim.info.nameId,
      dim.info.archetypeId,
      dim.score,
      result.maxPossibleScorePerDimension,
      `${dim.percentage}%`,
      status
    ]);
  });

  rows.push(['']);
  rows.push(['REKOMENDASI JALUR KARIR & PROGRAM STUDI']);
  rows.push(['Dimensi Primer', result.primaryDimension.nameId]);
  rows.push(['Pilihan Karir Unggulan', result.primaryDimension.sampleCareers.join(', ')]);
  rows.push(['Rekomendasi Jurusan / Studi', result.primaryDimension.recommendedMajors.join(', ')]);
  rows.push(['Lingkungan Kerja Ideal', result.primaryDimension.workEnvironment]);
  rows.push(['']);

  rows.push(['RINCIAN JAWABAN PER BUTIR PERTANYAAN (24 SOAL)']);
  rows.push(['No', 'Kode Dimensi', 'Pernyataan Soal', 'Poin Jawaban', 'Keterangan']);

  RIASEC_QUESTIONS.forEach((q) => {
    const val = result.answers[q.id] ?? 0;
    const label = val === 3 ? 'Sangat Setuju (3)' : val === 2 ? 'Setuju (2)' : val === 1 ? 'Netral (1)' : 'Tidak Setuju (0)';
    rows.push([
      q.id,
      q.dimension,
      q.statement,
      val,
      label
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 8 },
    { wch: 25 },
    { wch: 35 },
    { wch: 15 },
    { wch: 15 },
    { wch: 16 },
    { wch: 28 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Hasil Asesmen RIASEC');

  const cleanName = result.userName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `RIASEC_Report_${cleanName}_${result.topCode}.xlsx`;

  XLSX.writeFile(wb, filename);
}

/**
 * Export all saved assessments to a single consolidated Excel (.xlsx) workbook for Admin
 */
export function exportAllAssessmentsToExcel(results: AssessmentResult[]): void {
  if (results.length === 0) {
    throw new Error('Tidak ada data hasil asesmen untuk diekspor.');
  }

  const exportDate = new Date().toLocaleDateString('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const rows: (string | number)[][] = [
    ['REKAPITULASI HASIL ASESMEN KEPRIBADIAN KARIR RIASEC (HOLLAND CODE)'],
    ['Panel Administrator - RIASEC Explorer (24 Butir Soal)'],
    [`Tanggal Unduh Laporan: ${exportDate}`],
    [`Total Peserta Tersimpan: ${results.length} Orang`],
    [''],
    [
      'No',
      'Nama Peserta',
      'Usia (Th)',
      'Waktu Asesmen',
      'Holland Code',
      'Skor R (/12)',
      'Skor I (/12)',
      'Skor A (/12)',
      'Skor S (/12)',
      'Skor E (/12)',
      'Skor C (/12)',
      'Dimensi Primer',
      'Dimensi Sekunder',
      'Rekomendasi Profesi Utama',
      'Rekomendasi Jurusan Kuliah'
    ]
  ];

  results.forEach((item, index) => {
    const timeFormatted = new Date(item.timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    rows.push([
      index + 1,
      item.userName,
      item.userAge,
      timeFormatted,
      item.topCode,
      item.scores.R,
      item.scores.I,
      item.scores.A,
      item.scores.S,
      item.scores.E,
      item.scores.C,
      item.primaryDimension.nameId,
      item.secondaryDimension.nameId,
      item.primaryDimension.sampleCareers.slice(0, 3).join(', '),
      item.primaryDimension.recommendedMajors.slice(0, 3).join(', ')
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 6 },  // No
    { wch: 24 }, // Nama
    { wch: 10 }, // Usia
    { wch: 22 }, // Waktu
    { wch: 14 }, // Top Code
    { wch: 13 }, // R
    { wch: 13 }, // I
    { wch: 13 }, // A
    { wch: 13 }, // S
    { wch: 13 }, // E
    { wch: 13 }, // C
    { wch: 18 }, // Primer
    { wch: 18 }, // Sekunder
    { wch: 38 }, // Karir
    { wch: 38 }  // Jurusan
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Rekapitulasi Semua Peserta');

  const filename = `RIASEC_Rekap_Peserta_${Date.now()}.xlsx`;
  XLSX.writeFile(wb, filename);
}

