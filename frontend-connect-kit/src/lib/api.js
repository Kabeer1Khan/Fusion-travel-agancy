// Backend से बात करने वाला एक ही client। Token अपने-आप हर request में जुड़ता है।
// CRA (create-react-app) इस्तेमाल कर रहे हो तो नीचे import.meta.env.VITE_API_URL की जगह process.env.REACT_APP_API_URL लिखो।
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const TOKEN_KEY = 'ft_token';
export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function request(path, { method = 'GET', body, params, signal } = {}) {
  const query = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null)).toString()
    : '';
  const token = tokenStore.get();

  let res;
  try {
    res = await fetch(`${BASE}${path}${query}`, {
      method,
      signal,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    // Render की free service सोई हो तो पहली request 30-60 सेकंड ले सकती है
    throw new ApiError('Cannot reach the server. Please check your connection and try again.', 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) {
      tokenStore.clear();
      window.dispatchEvent(new Event('ft:auth-expired'));
    }
    throw new ApiError(data.message || `Request failed (${res.status})`, res.status);
  }
  return data;
}

export const api = {
  get: (p, params, signal) => request(p, { params, signal }),
  post: (p, body) => request(p, { method: 'POST', body }),
  put: (p, body) => request(p, { method: 'PUT', body }),
  patch: (p, body) => request(p, { method: 'PATCH', body }),
  del: (p) => request(p, { method: 'DELETE' }),
};
