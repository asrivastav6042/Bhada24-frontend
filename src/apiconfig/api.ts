// Auto-generated minimal API client for Bhada24 backend
// Extracted from OpenAPI spec at https://bhada24-core.onrender.com/v3/api-docs
// Keeps a small, central place for HTTP calls used by the frontend.

// Backend URLs
export const BASE_URL = 'https://bhada24-core-4xlb.onrender.com'; // Default backend
export const BOOKING_BASE_URL = 'https://bhada24-main-15sp.onrender.com'; // Booking service

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Lightweight fetch wrapper that sends/receives JSON and throws on non-2xx.
 * - path: absolute path including leading slash (eg. '/api/users/register')
 * - method: HTTP verb
 * - body: JSON-serializable body for POST/PUT/PATCH
 * - params: query params map
 * - token: optional bearer token to attach
 * - baseUrl: optional custom base URL (defaults to BASE_URL)
 */
export async function request<T = any>(
  path: string,
  method: HttpMethod = 'GET',
  body?: any,
  params?: Record<string, string | number | boolean>,
  token?: string,
  retryCount = 0,
  baseUrl: string = BASE_URL
): Promise<T> {
  let url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

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
  // If token provided explicitly, use it. Otherwise try to read stored token from sessionStorage/localStorage.
  const TOKEN_KEY = 'bhada24_token';
  const storedToken =
    token || sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || undefined;
  if (storedToken) headers['Authorization'] = `Bearer ${storedToken}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Debugging aid: log final request URL and body for troubleshooting (can be removed later)
  try {
    // only log in dev-like environments
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[api] request', method, url, { body, params });
    }
  } catch (e) {
    /* ignore */
  }

  if (!res.ok) {
    const txt = await res.text();
    
    // If we get 401 Unauthorized and haven't retried yet, try to refresh the token
    if (res.status === 401 && retryCount === 0) {
      try {
        // Dynamically import authService to avoid circular dependencies
        const { refreshToken } = await import('@/services/authService');
        const newToken = await refreshToken();
        
        if (newToken) {
          // Retry the request with the new token
          return request<T>(path, method, body, params, newToken, retryCount + 1, baseUrl);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Clear token and redirect to login
        sessionStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem('bhada24_token_expiry');
        localStorage.removeItem('bhada24_token_expiry');
        
        // Check if we're not already on login page to avoid infinite redirect
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
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
/**
 * Update user. The backend expects the user id inside the request body (userId / id).
 * Do not send the id as a query parameter to avoid server-side validation issues.
 */
export const updateUser = (payload: unknown) => request('/api/users/update', 'PATCH', payload);

// Offers
export const getAllOffers = () => request('/api/common/offer/all', 'GET');
export const getAllValidOffers = () => request('/api/common/offer/all/valid', 'GET');
export const createOffer = (payload: unknown, token?: string) =>
  request('/api/common/offer/create', 'POST', payload, undefined, token);

// Upload image (base64)
export const uploadBase64Image = (payload: unknown) =>
  request('/api/common/uploadBase64Image', 'POST', payload);

// Notifications / FCM
// Notifications / FCM
// Ensure Authorization header is attached by request(); endpoints per Swagger
export const registerFCMToken = (payload: unknown, token?: string) =>
  request('/api/common/notifications/register-token', 'POST', payload, undefined, token);
export const updateFCMToken = (payload: unknown, token?: string) =>
  request('/api/common/notifications/update/fcm-token', 'POST', payload, undefined, token);
export const sendNotificationToUser = (payload: unknown, token?: string) =>
  request('/api/common/notifications/send-notification', 'POST', payload, undefined, token);

// Cab Booking (uses separate booking service base URL)
export const startBooking = (payload: unknown, token?: string) =>
  request('/api/cab/booking/startbooking', 'POST', payload, undefined, token, 0, BOOKING_BASE_URL);
export const getBookingsByUserId = (userId: string, token?: string) =>
  request(`/api/cab/booking/get-by-userid/${userId}`, 'GET', undefined, undefined, token, 0, BOOKING_BASE_URL);

// Update booking status (cancel booking)
export const updateBookingStatus = (payload: {
  bookingId: string;
  cabId: string;
  bookingStatus: string;
  paymentStatus: string;
  role: string;
}, token?: string) =>
  request('/api/cab/booking/update-booking-status', 'PUT', payload, undefined, token, 0, BOOKING_BASE_URL);

// Cab Rating
export const addCabRating = (payload: unknown, token?: string) =>
  request('/api/common/cab-rating/add', 'POST', payload, undefined, token);
export const getUserRatings = (userId: string, token?: string) =>
  request(`/api/common/cab-rating/user/${userId}`, 'GET', undefined, undefined, token);

// Expose everything useful
export default {
  BASE_URL,
  BOOKING_BASE_URL,
  request,
  // jwt
  generateToken,
  // users
  registerUser,
  getUserByMobile,
  updateUser,
  getAllUsers,
  // offers
  getAllOffers,
  getAllValidOffers,
  createOffer,
  // upload
  uploadBase64Image,
  // notifications
  registerFCMToken,
  updateFCMToken,
  sendNotificationToUser,
  // bookings
  startBooking,
  getBookingsByUserId,
  updateBookingStatus,
  // ratings
  addCabRating,
  getUserRatings,
};
