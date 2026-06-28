const STORAGE_KEY = 'user-storage';

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw)?.state || null;
  } catch {
    return null;
  }
}

export function setStoredAccessToken(accessToken) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed?.state) return;
    parsed.state.accessToken = accessToken;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
}

export function isStaleSessionError(error) {
  const message = String(error?.response?.data?.message || '').toLowerCase();
  const code = error?.response?.data?.code;
  return (
    code === 'USER_NOT_FOUND' ||
    message.includes('user not found') ||
    message.includes('not authorized, user not found')
  );
}

export function clearStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed?.state) return;
    parsed.state.user = null;
    parsed.state.accessToken = null;
    parsed.state.refreshToken = null;
    parsed.state.isAuthenticated = false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage errors
  }
}
