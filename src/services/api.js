import { Platform } from 'react-native';
import { API_URL } from '../config';

const TOKEN_KEY = 'sg_guard_token';

export function getToken() {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return global.__sgToken || null;
}

export function setToken(token) {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }
  global.__sgToken = token || null;
}

export async function api(path, options = {}) {
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(json.message || 'Request failed');
    err.errors = json.errors;
    err.status = res.status;
    throw err;
  }

  return json;
}

export function unwrapList(payload) {
  const data = payload?.data;
  if (Array.isArray(data)) return data;
  if (data?.data && Array.isArray(data.data)) return data.data;
  return [];
}

export async function downloadFile(path, filename) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: '*/*',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.message || 'Download failed');
  }

  const blob = await res.blob();
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    return;
  }

  return blob;
}
