import api from '@/apiconfig/api';

export interface FcmPayload {
  userId: string;
  fcmToken: string;
  deviceType?: string; // e.g. 'ANDROID' | 'IOS' | 'WEB'
  userType?: string; // e.g. 'USER'
}

/**
 * Register a new FCM token for the user.
 */
export async function registerFcmToken(payload: FcmPayload) {
  // persist token locally for quick access
  try { localStorage.setItem('fcmToken', payload.fcmToken); } catch (e) {}
  try { sessionStorage.setItem('fcmToken', payload.fcmToken); } catch (e) {}
  // Ensure auth header goes along; api.request will include stored token too
  const token = sessionStorage.getItem('bhada24_token') || localStorage.getItem('bhada24_token') || undefined;
  return api.registerFCMToken(payload, token);
}

/**
 * Update existing FCM token on server (separate endpoint per backend screenshot).
 */
export async function updateFcmToken(payload: FcmPayload) {
  try { localStorage.setItem('fcmToken', payload.fcmToken); } catch (e) {}
  try { sessionStorage.setItem('fcmToken', payload.fcmToken); } catch (e) {}
  const token = sessionStorage.getItem('bhada24_token') || localStorage.getItem('bhada24_token') || undefined;
  // if backend exposes update endpoint, prefer it; fallback to register
  try {
    // updateFCMToken returns a Promise; await it so we can catch rejections here.
    return await api.updateFCMToken(payload, token);
  } catch (err) {
    return await api.registerFCMToken(payload, token);
  }
}

export default { registerFcmToken, updateFcmToken };
