// Auto-generated minimal API client for Bhada24 backend
// Extracted from OpenAPI spec at https://bhada24-core.onrender.com/v3/api-docs
// Keeps a small, central place for HTTP calls used by the frontend.

export const BASE_URL = 'https://bhada24-core.onrender.com';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Lightweight fetch wrapper that sends/receives JSON and throws on non-2xx.
 * - path: absolute path including leading slash (eg. '/api/users/register')
 * - method: HTTP verb
 * - body: JSON-serializable body for POST/PUT/PATCH
 * - params: query params map
 * - token: optional bearer token to attach
 */
export async function request<T = any>(
  path: string,
  method: HttpMethod = 'GET',
  body?: any,
  params?: Record<string, string | number | boolean>,
  token?: string
): Promise<T> {
  let url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  if (params && Object.keys(params).length) {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) search.append(k, String(v));
    }
    const q = search.toString();
    if (q) url += `?${q}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Request failed ${res.status} ${res.statusText}: ${txt}`);
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return res.json();
  return (await res.text()) as unknown as T;
}

// --- Convenience helpers (a small subset of useful endpoints from the spec)

// JWT
export const generateToken = (payload: unknown) =>
  request<{ token: string }>('/auth/generate/token', 'POST', payload);

// Users
export const registerUser = (payload: unknown) =>
  request('/api/users/register', 'POST', payload);
export const getUserByMobile = (mobile: string) =>
  request(`/api/users/find/${encodeURIComponent(mobile)}`, 'GET');
export const getAllUsers = () => request('/api/users/all', 'GET');

// Offers
export const getAllOffers = () => request('/api/common/offer/all', 'GET');
export const getAllValidOffers = () => request('/api/common/offer/all/valid', 'GET');
export const createOffer = (payload: unknown, token?: string) =>
  request('/api/common/offer/create', 'POST', payload, undefined, token);

// Upload image (base64)
export const uploadBase64Image = (payload: unknown) =>
  request('/api/common/uploadBase64Image', 'POST', payload);

// Notifications / FCM
export const registerFCMToken = (payload: unknown) =>
  request('/api/common/notifications/register-token', 'POST', payload);
export const sendNotificationToUser = (payload: unknown, token?: string) =>
  request('/api/common/notifications/send-notification', 'POST', payload, undefined, token);

// Expose everything useful
export default {
  BASE_URL,
  request,
  // jwt
  generateToken,
  // users
  registerUser,
  getUserByMobile,
  getAllUsers,
  // offers
  getAllOffers,
  getAllValidOffers,
  createOffer,
  // upload
  uploadBase64Image,
  // notifications
  registerFCMToken,
  sendNotificationToUser,
};
