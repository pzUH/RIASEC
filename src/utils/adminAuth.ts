const STORAGE_ADMIN_PASSWORD_KEY = 'riasec_admin_password';
const STORAGE_ADMIN_SESSION_KEY = 'riasec_admin_session';

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin123';

/**
 * Get current admin password from localStorage or fallback to default
 */
export function getAdminPassword(): string {
  try {
    const saved = localStorage.getItem(STORAGE_ADMIN_PASSWORD_KEY);
    return saved || DEFAULT_ADMIN_PASSWORD;
  } catch {
    return DEFAULT_ADMIN_PASSWORD;
  }
}

/**
 * Validate admin login credentials
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  const currentPassword = getAdminPassword();
  return (
    username.trim().toLowerCase() === DEFAULT_ADMIN_USERNAME &&
    password === currentPassword
  );
}

/**
 * Change admin password
 */
export function changeAdminPassword(
  oldPass: string,
  newPass: string,
  confirmPass: string
): { success: boolean; message: string } {
  const currentPassword = getAdminPassword();

  if (oldPass !== currentPassword) {
    return { success: false, message: 'Password lama yang Anda masukkan salah.' };
  }

  if (!newPass || newPass.trim().length < 4) {
    return { success: false, message: 'Password baru minimal 4 karakter.' };
  }

  if (newPass !== confirmPass) {
    return { success: false, message: 'Konfirmasi password baru tidak cocok.' };
  }

  try {
    localStorage.setItem(STORAGE_ADMIN_PASSWORD_KEY, newPass);
    return { success: true, message: 'Password admin berhasil diperbarui!' };
  } catch (err) {
    return { success: false, message: 'Gagal menyimpan password ke penyimpanan lokal.' };
  }
}

/**
 * Check if admin session is currently active
 */
export function isAdminSessionActive(): boolean {
  try {
    return localStorage.getItem(STORAGE_ADMIN_SESSION_KEY) === 'active';
  } catch {
    return false;
  }
}

/**
 * Set admin session status
 */
export function setAdminSession(active: boolean): void {
  try {
    if (active) {
      localStorage.setItem(STORAGE_ADMIN_SESSION_KEY, 'active');
    } else {
      localStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
    }
  } catch {
    // ignore
  }
}
