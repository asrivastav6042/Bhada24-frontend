import api from '@/apiconfig/api';
import { sendOtp, verifyOtp, ConfirmationResult, initRecaptcha, resetRecaptcha } from './firebaseOtpService';
import { registerFcmToken } from './notificationService';
import { User } from '@/models/User';

const TOKEN_KEY = 'bhada24_token';

export function setToken(token: string) {
  // persist token in both places for reliability (session primary, local as fallback)
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    // ignore
  }
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    // ignore
  }
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || null;
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

function normalizeE164(phone: string) {
  if (!phone) return phone;
  if (phone.startsWith('+')) return phone;
  // assume Indian mobile if 10 digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  return phone;
}

/**
 * Start the phone login flow. Returns Firebase ConfirmationResult which must be used to confirm the OTP.
 */
export async function startPhoneLogin(phone: string, recaptchaContainerId = 'recaptcha-container') {
  const e164 = normalizeE164(phone);
  // Ensure we have a fresh verifier bound to a live DOM node before sending
  try { resetRecaptcha(); } catch {}
  initRecaptcha(recaptchaContainerId);
  const confirmation = await sendOtp(e164, recaptchaContainerId);
  return confirmation as ConfirmationResult;
}

/**
 * Verify OTP using the firebase confirmation result and then authenticate/register with backend.
 * Returns { user, token }
 */
export async function verifyOtpAndLogin(confirmationResult: ConfirmationResult, code: string, phone: string) {
  // verify with firebase
  await verifyOtp(confirmationResult, code);

  // get backend token (static key + password as requested)
  const tokenResp = await api.generateToken({ key: 'BHADA24', password: 'P@55word' });
  console.debug('generateToken response', tokenResp);
  const token = (tokenResp as any)?.token || (tokenResp as any).token;
  if (token) {
    setToken(token);
    console.debug('stored token', token.slice ? token.slice(0, 10) + '...' : token);
  } else {
    console.warn('No token received from generateToken', tokenResp);
  }

  const mobilePlain = phone.replace(/\D/g, '');
  // Always try to fetch the user after token is obtained. If not present, register and re-fetch.
  try {
  const res = await api.getUserByMobile(mobilePlain);
  console.debug('getUserByMobile response', res);
  const user = (res as any)?.responseData || res;
    const foundId = (user && ((user as any).userId || (user as any).id || (user as any).user_id)) || undefined;
    if (foundId) {
      try { localStorage.setItem('userId', String(foundId)); } catch (e) {}
      try { sessionStorage.setItem('userId', String(foundId)); } catch (e) {}
      // if an FCM token is present locally, register it with backend for this user
      try {
        const fcm = localStorage.getItem('fcmToken') || sessionStorage.getItem('fcmToken');
        if (fcm) {
          // fire-and-forget; don't block login
          registerFcmToken({ userId: String(foundId), fcmToken: fcm, deviceType: 'WEB', userType: 'USER' }).catch((e) => {
            // eslint-disable-next-line no-console
            console.debug('registerFcmToken failed', e);
          });
        }
      } catch (e) {}
    }
    try { localStorage.setItem('userPhone', mobilePlain); } catch (e) {}
    try { sessionStorage.setItem('userPhone', mobilePlain); } catch (e) {}
    try { localStorage.setItem('userName', (user && (user as User).name) || ''); } catch (e) {}
    try { sessionStorage.setItem('userName', (user && (user as User).name) || ''); } catch (e) {}
    return { user, token };
  } catch (err) {
    // not found -> register then fetch again
    const defaultName = `User${mobilePlain.slice(-4)}`;
    const payload: Partial<User> = {
      name: defaultName,
      phone: mobilePlain,
      role: 'USER',
      verified: true,
    };

    try {
  const regResp = await api.registerUser(payload);
  console.debug('registerUser response', regResp);
  // after registration try to fetch created user to obtain id
  const res2 = await api.getUserByMobile(mobilePlain);
  console.debug('getUserByMobile after register response', res2);
  const created = (res2 as any)?.responseData || res2;
      const createdId = (created && ((created as any).userId || (created as any).id || (created as any).user_id)) || undefined;
      if (createdId) {
        try { localStorage.setItem('userId', String(createdId)); } catch (e) {}
        try { sessionStorage.setItem('userId', String(createdId)); } catch (e) {}
        try {
          const fcm = localStorage.getItem('fcmToken') || sessionStorage.getItem('fcmToken');
          if (fcm) {
            registerFcmToken({ userId: String(createdId), fcmToken: fcm, deviceType: 'WEB', userType: 'USER' }).catch((e) => {
              // eslint-disable-next-line no-console
              console.debug('registerFcmToken after register failed', e);
            });
          }
        } catch (e) {}
      }
      try { localStorage.setItem('userPhone', mobilePlain); } catch (e) {}
      try { sessionStorage.setItem('userPhone', mobilePlain); } catch (e) {}
      try { localStorage.setItem('userName', (created && (created as User).name) || payload.name || ''); } catch (e) {}
      try { sessionStorage.setItem('userName', (created && (created as User).name) || payload.name || ''); } catch (e) {}
      return { user: created, token };
    } catch (regErr: any) {
      console.error('User registration or fetch failed', regErr);
      throw regErr;
    }
  }
}
