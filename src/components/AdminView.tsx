import React, { useState } from 'react';
import { AssessmentResult } from '../types/riasec';
import {
  verifyAdminCredentials,
  changeAdminPassword,
  isAdminSessionActive,
  setAdminSession
} from '../utils/adminAuth';
import { exportToExcel, exportAllAssessmentsToExcel } from '../utils/exportUtils';
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  LogOut,
  FileSpreadsheet,
  Trash2,
  Eye,
  Search,
  Users,
  CheckCircle2,
  Calendar,
  Key,
  X,
  ChevronRight
} from 'lucide-react';

interface AdminViewProps {
  history: AssessmentResult[];
  onSelectResult: (result: AssessmentResult) => void;
  onDeleteSingle: (id: string) => void;
  onClearAll: () => void;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  history,
  onSelectResult,
  onDeleteSingle,
  onClearAll,
  onShowToast
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isAdminSessionActive());
  const [usernameInput, setUsernameInput] = useState<string>('admin');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Password change modal state
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [pwdError, setPwdError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminCredentials(usernameInput, passwordInput)) {
      setAdminSession(true);
      setIsAuthenticated(true);
      setLoginError(null);
      setPasswordInput('');
      onShowToast('success', 'Berhasil masuk ke Panel Administrator!');
    } else {
      setLoginError('Username atau password salah. (Default: admin & admin123)');
    }
  };

  const handleLogout = () => {
    setAdminSession(false);
    setIsAuthenticated(false);
    onShowToast('info', 'Anda telah keluar dari Panel Admin.');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = changeAdminPassword(oldPassword, newPassword, confirmPassword);
    if (result.success) {
      onShowToast('success', result.message);
      setIsChangingPassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwdError(null);
    } else {
      setPwdError(result.message);
    }
  };

  const handleExportIndividual = (item: AssessmentResult) => {
    try {
      exportToExcel(item);
      onShowToast('success', `Laporan Excel untuk ${item.userName} berhasil diunduh!`);
    } catch {
      onShowToast('error', 'Gagal mengekspor file Excel.');
    }
  };

  const handleExportAll = () => {
    try {
      exportAllAssessmentsToExcel(history);
      onShowToast('success', `Rekapitulasi ${history.length} peserta berhasil diunduh ke Excel (.xlsx)!`);
    } catch (err: any) {
      onShowToast('error', err.message || 'Gagal mengekspor data rekapitulasi.');
    }
  };

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.userName.toLowerCase().includes(term) ||
      item.topCode.toLowerCase().includes(term)
    );
  });

  // If not logged in, show Login Screen
  if (!isAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-12 pb-36 animate-in fade-in duration-300">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-cyan-300 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-600/20">
              <ShieldCheck className="w-7 h-7 text-cyan-300" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Login Administrator
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Akses manajemen hasil tes & ekspor data RIASEC
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 text-xs rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Username admin"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password admin"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-all"
                required
                autoFocus
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Akun bawaan awal: <strong className="text-slate-300">admin</strong> / <strong className="text-slate-300">admin123</strong>
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl glass-button-primary font-bold text-sm text-white flex items-center justify-center gap-2 shadow-xl"
              >
                <KeyRound className="w-4 h-4 text-cyan-300" />
                <span>Masuk ke Panel Admin</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 pb-40 animate-in fade-in duration-300">
      {/* Admin Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden mb-6">
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Panel Administrator Aktif</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Manajemen Hasil Asesmen RIASEC
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Kelola data peserta, ekspor spreadsheet (.xlsx), dan konfigurasi keamanan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Ganti Password</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Quick Stats & Bulk Actions */}
        <div className="relative z-10 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-cyan-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Total Peserta Tersimpan</div>
              <div className="text-2xl font-black text-white">
                {history.length} <span className="text-xs font-normal text-slate-400">Hasil Asesmen</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportAll}
              disabled={history.length === 0}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                history.length > 0
                  ? 'bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-400/40 text-emerald-200 shadow-lg'
                  : 'bg-white/5 text-slate-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Simpan Semua (.xlsx)</span>
            </button>

            {history.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('PERINGATAN: Kosongkan dan hapus SEMUA hasil tes peserta yang tersimpan? Tindakan ini tidak dapat dibatalkan.')) {
                    onClearAll();
                    onShowToast('info', 'Semua data hasil tes telah dibersihkan.');
                  }
                }}
                className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl glass-panel text-white border border-white/20 shadow-2xl">
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Ganti Password Admin</h3>
              </div>
              <button
                onClick={() => setIsChangingPassword(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              {pwdError && (
                <div className="p-3 text-xs rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200">
                  {pwdError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password Lama
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan password lama"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 4 karakter"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/60 border border-white/15 text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg"
                >
                  Simpan Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/15 mb-5 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan nama peserta atau 3 kode Holland (misal: Budi, RIA, SEC)..."
          className="w-full bg-transparent border-none text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-white px-2 py-1"
          >
            Hapus
          </button>
        )}
      </div>

      {/* Assessment Table & Cards */}
      {filteredHistory.length === 0 ? (
        <div className="glass-panel p-10 rounded-3xl border border-white/15 text-center">
          <Users className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">Tidak Ada Data Peserta</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm
              ? `Tidak ditemukan hasil yang cocok dengan kata kunci "${searchTerm}".`
              : 'Belum ada data asesmen yang tersimpan di sistem.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item, idx) => {
            const dateStr = new Date(item.timestamp).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.id}
                className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-white/20 transition-all"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                    {idx + 1}
                  </div>

                  {/* Big Code Pill */}
                  <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-400/30 flex flex-col items-center justify-center min-w-[72px]">
                    <span className="text-[9px] uppercase font-bold text-indigo-300">
                      Kode
                    </span>
                    <span className="text-base font-black tracking-widest text-white">
                      {item.topCode}
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{item.userName}</span>
                      <span className="text-xs text-slate-400 font-normal">
                        ({item.userAge} Th)
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      <span>{dateStr}</span>
                    </div>

                    {/* Scores row */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {(['R', 'I', 'A', 'S', 'E', 'C'] as const).map((dimKey) => (
                        <span
                          key={dimKey}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300"
                        >
                          <strong>{dimKey}:</strong> {item.scores[dimKey]}/12
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row Actions: View, Export XLS, Delete */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => onSelectResult(item)}
                    className="px-3 py-2 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/30 text-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Buka Laporan Hasil"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Lihat</span>
                  </button>

                  <button
                    onClick={() => handleExportIndividual(item)}
                    className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/30 text-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    title="Simpan Laporan (.xlsx)"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Excel (.xlsx)</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus data asesmen peserta "${item.userName}"?`)) {
                        onDeleteSingle(item.id);
                        onShowToast('info', `Data ${item.userName} telah dihapus.`);
                      }
                    }}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-colors"
                    title="Hapus data peserta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
