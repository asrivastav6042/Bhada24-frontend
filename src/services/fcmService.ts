import initFirebaseApp from './firebaseInit';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { registerFcmToken } from './notificationService';

// Key for storing notifications locally
const STORAGE_KEY = 'bhada24_notifications';

export type LocalNotification = {
  id: string;
  title?: string;
  body?: string;
  data?: any;
  ts: string;
  read?: boolean;
};

/**
 * Initialize Firebase Messaging, request permission, get token and register it with backend.
 * - vapidKey can be provided via import.meta.env.VITE_FIREBASE_VAPID_KEY
 */
export async function initFcmAndRegister(userId?: string) {
  try {
    initFirebaseApp();
    const messaging = getMessaging();

    // ask for Notification permission
    if (Notification.permission !== 'granted') {
      const res = await Notification.requestPermission();
      if (res !== 'granted') return null;
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY || undefined;
    let token: string | null = null;
    try {
      token = await getToken(messaging as any, { vapidKey } as any);
    } catch (e) {
      // try without options (may fail on some browsers)
      try {
        token = await getToken(messaging as any);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.debug('getToken failed', err);
      }
    }

    if (token) {
      try { localStorage.setItem('fcmToken', token); } catch (e) {}
      try { sessionStorage.setItem('fcmToken', token); } catch (e) {}
      if (userId) {
        // register token on backend
        registerFcmToken({ userId, fcmToken: token, deviceType: 'WEB', userType: 'USER' }).catch((e) => {
          // eslint-disable-next-line no-console
          console.debug('registerFcmToken failed', e);
        });
      }
    }

    // handle foreground messages
    try {
      onMessage(messaging as any, (payload) => {
        // payload may have notification or data
        const notification = (payload as any).notification || (payload as any).data || {};
        const title = notification.title || notification?.notification?.title || 'Notification';
        const body = notification.body || notification?.notification?.body || '';
        const id = (Date.now() + Math.random()).toString(36);
        const note = { id, title, body, data: payload.data || payload, ts: new Date().toISOString(), read: false } as LocalNotification;

        // persist locally
        try {
          const raw = localStorage.getItem(STORAGE_KEY) || '[]';
          const arr = JSON.parse(raw) || [];
          arr.unshift(note);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
        } catch (e) {
          // ignore
        }

        // dispatch an event to update UI
        try {
          window.dispatchEvent(new CustomEvent('bhada24:notifications-updated', { detail: note }));
        } catch (e) {}

        // optionally show a system notification (if permission granted)
        try {
          if (Notification.permission === 'granted') {
            new Notification(note.title || 'Notification', { body: note.body || '' });
          }
        } catch (e) {}
      });
    } catch (e) {
      // ignore
    }

    // listen to service worker messages (background messages forwarded by SW)
    try {
      navigator.serviceWorker?.addEventListener('message', (event) => {
        const msg = (event as any).data;
        if (!msg) return;
        if (msg.type === 'FCM_BACKGROUND_MESSAGE') {
          const payload = msg.payload || {};
          const notification = payload.notification || payload.data || {};
          const title = notification.title || 'Notification';
          const body = notification.body || notification.message || '';
          const id = (Date.now() + Math.random()).toString(36);
          const note = { id, title, body, data: payload.data || payload, ts: new Date().toISOString(), read: false } as LocalNotification;
          try {
            const raw = localStorage.getItem(STORAGE_KEY) || '[]';
            const arr = JSON.parse(raw) || [];
            arr.unshift(note);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
          } catch (e) {}
          try { window.dispatchEvent(new CustomEvent('bhada24:notifications-updated', { detail: note })); } catch (e) {}
        }
      });
    } catch (e) {}

    return token;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.debug('initFcmAndRegister failed', e);
    return null;
  }
}

export function getLocalNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || '[]';
    return JSON.parse(raw) as LocalNotification[];
  } catch (e) {
    return [];
  }
}

export function markNotificationRead(id: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || '[]';
    const arr = JSON.parse(raw) as LocalNotification[] || [];
    const idx = arr.findIndex((n) => n.id === id);
    if (idx !== -1) arr[idx].read = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    try { window.dispatchEvent(new CustomEvent('bhada24:notifications-updated', { detail: null })); } catch (e) {}
  } catch (e) {}
}

export default { initFcmAndRegister, getLocalNotifications, markNotificationRead };
