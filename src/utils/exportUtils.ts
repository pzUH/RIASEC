import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { AssessmentResult } from '../types/riasec';
import { RIASEC_QUESTIONS } from '../data/riasecData';
import { getCombinedCodeSummary } from './riasecCalculator';

/**
 * Export assessment data to Excel (.xlsx) file using SheetJS
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

  // Multidimensional data array for worksheet
  const rows: (string | number)[][] = [
    ['LAPORAN HASIL ASESMEN KEPRIBADIAN KARIR RIASEC'],
    ['Model Tipologi Karir John L. Holland - RIASEC Explorer'],
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
    else if (dim.score >= 3) status = 'Moderat';

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
  rows.push(['Dimensi Sekunder', result.secondaryDimension.nameId]);
  rows.push(['Pilihan Karir Pendukung', result.secondaryDimension.sampleCareers.join(', ')]);
  rows.push(['']);
  rows.push(['Dimensi Tersier', result.tertiaryDimension.nameId]);
  rows.push(['Pilihan Karir Tambahan', result.tertiaryDimension.sampleCareers.join(', ')]);
  rows.push(['']);

  rows.push(['RINCIAN JAWABAN PER BUTIR PERTANYAAN (12 SOAL)']);
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

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // Col A
    { wch: 25 }, // Col B
    { wch: 35 }, // Col C
    { wch: 15 }, // Col D
    { wch: 15 }, // Col E
    { wch: 16 }, // Col F
    { wch: 28 }  // Col G
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Hasil Asesmen RIASEC');

  const cleanName = result.userName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `RIASEC_Report_${cleanName}_${result.topCode}.xlsx`;

  XLSX.writeFile(wb, filename);
}

/**
 * Capture HTMLElement to Canvas and either trigger Web Share API (mobile) or download PNG (desktop/fallback)
 */
export async function captureAndShareCard(
  cardElement: HTMLElement,
  result: AssessmentResult
): Promise<{ success: boolean; sharedViaApi: boolean; message: string }> {
  try {
    // Generate high quality canvas
    const canvas = await html2canvas(cardElement, {
      scale: 2, // 2x retina clarity
      useCORS: true,
      backgroundColor: '#090D16',
      logging: false,
      allowTaint: true
    });

    const cleanName = result.userName.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `RIASEC_Card_${cleanName}_${result.topCode}.png`;

    // Convert to Blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png', 0.95);
    });

    if (!blob) {
      throw new Error('Gagal menghasilkan file gambar.');
    }

    const file = new File([blob], filename, { type: 'image/png' });

    // Check if Web Share API is available and can share files (typically Mobile browsers)
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: `Hasil Tes RIASEC: ${result.topCode} - ${result.userName}`,
          text: `Halo! Saya telah menyelesaikan tes kepribadian karir Holland di RIASEC Explorer. Tiga kode utama saya adalah: ${result.topCode}. Cek potensi karir Anda juga!`,
          files: [file]
        });
        return {
          success: true,
          sharedViaApi: true,
          message: 'Berhasil dibagikan melalui menu sistem!'
        };
      } catch (err: any) {
        // If user cancelled the native share sheet, don't force auto-download error
        if (err.name === 'AbortError') {
          return {
            success: true,
            sharedViaApi: true,
            message: 'Menu berbagi ditutup.'
          };
        }
        // Otherwise fall through to file download
      }
    }

    // Fallback: Direct Download PNG for desktop or unsupported browsers
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);

    return {
      success: true,
      sharedViaApi: false,
      message: 'Kartu hasil berhasil diunduh dalam format gambar PNG!'
    };
  } catch (error: any) {
    console.error('Error during card capture & share:', error);
    return {
      success: false,
      sharedViaApi: false,
      message: error?.message || 'Terjadi kesalahan saat memproses gambar kartu.'
    };
  }
}
