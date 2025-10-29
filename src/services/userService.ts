import api from '@/apiconfig/api';
import type { User } from '@/models/User';

/** Update user profile on backend. Expects a partial User object with fields to update. */
export async function updateProfile(payload: Partial<User>) {
  // read userId from storage and ensure it's included in the request body (backend expects id in body)
  let storedId = payload.userId || localStorage.getItem('userId') || sessionStorage.getItem('userId') || undefined;

  // If we don't have an id, try to fetch the user by phone to obtain it
  if (!storedId) {
    const phoneFromPayload = (payload as any).phone || localStorage.getItem('userPhone') || sessionStorage.getItem('userPhone');
    if (phoneFromPayload) {
      try {
        console.debug('updateProfile: fetching user by phone to obtain id', phoneFromPayload);
        const findRes = await api.getUserByMobile(String(phoneFromPayload));
        const found = (findRes as any)?.responseData || findRes;
        const foundId = (found && ((found as any).userId || (found as any).id || (found as any).user_id)) || undefined;
        if (foundId) {
          storedId = String(foundId);
          try {
            localStorage.setItem('userId', storedId);
          } catch (e) {
            /* ignore */
          }
          try {
            sessionStorage.setItem('userId', storedId);
          } catch (e) {
            /* ignore */
          }
        }
      } catch (e) {
        console.warn('updateProfile: could not fetch user by phone', e);
      }
    }
  }

  // Ensure we send id in body (backend expects id in payload). Do NOT send as query param.
  if (storedId) {
    (payload as any).userId = (payload as any).userId || storedId;
    (payload as any).id = (payload as any).id || storedId;
  }
  const res = await api.updateUser(payload);
  return (res as any)?.responseData || res;
}

/**
 * Fetch user profile by mobile number.
 */
export async function getProfileByMobile(mobile: string) {
  const res = await api.getUserByMobile(mobile);
  // Debug: show raw response shape so we can adapt to backend variants during development
  try {
    // eslint-disable-next-line no-console
    console.debug('[userService] getProfileByMobile raw response for', mobile, res);
  } catch (e) {}

  // Normalize common response shapes:
  // - { responseData: [{ ...user }] }
  // - { responseData: { ...user } }
  // - { ...user }
  let u: any = (res as any)?.responseData ?? res;
  if (u && typeof u === 'object') {
    // unwrap nested `data` if present
    if ('data' in u) u = u.data;
    // if backend returned an array of users, take the first one
    if (Array.isArray(u)) u = u[0];
  }

  try {
    // eslint-disable-next-line no-console
    console.debug('[userService] getProfileByMobile normalized user for', mobile, u);
  } catch (e) {}

  return u;
}

export default { updateProfile, getProfileByMobile };
