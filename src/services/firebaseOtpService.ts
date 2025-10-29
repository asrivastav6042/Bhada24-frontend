import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  User as FirebaseUser,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBTtN4eYCdc1_IybkSi7EIU1br52rZy2To',
  authDomain: 'bhada24-96846.firebaseapp.com',
  projectId: 'bhada24-96846',
  storageBucket: 'bhada24-96846.firebasestorage.app',
  messagingSenderId: '200383906913',
  appId: '1:200383906913:web:48a06fb49870731f045620',
  measurementId: 'G-SW8DZ4PZT6',
};

let app: FirebaseApp | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

function initFirebase() {
  if (!app) app = initializeApp(firebaseConfig);
  return app;
}

/**
 * Initialize an invisible RecaptchaVerifier and store it for the next send attempt.
 * Recreates the verifier only when explicitly asked (e.g., on resend).
 */
export function initRecaptcha(containerId = 'recaptcha-container') {
  initFirebase();
  const auth = getAuth();
  // Clean up any previous instance to avoid stale sessions
  if (recaptchaVerifier) {
    try {
      // @ts-ignore internal API cleanup if available
      recaptchaVerifier.clear && recaptchaVerifier.clear();
    } catch {}
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  recaptchaVerifier = new (RecaptchaVerifier as any)(containerId, { size: 'invisible' }, auth);
  return recaptchaVerifier;
}

/**
 * Send OTP using the current (or newly created) RecaptchaVerifier.
 * Returns ConfirmationResult which must be kept and reused for confirm.
 */
export async function sendOtp(phoneNumber: string, containerId = 'recaptcha-container') {
  initFirebase();
  const auth = getAuth();
  const verifier = recaptchaVerifier || initRecaptcha(containerId);
  const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
  return confirmation as ConfirmationResult;
}

/**
 * Verify a code against the provided ConfirmationResult and return firebase user.
 */
export async function verifyOtp(confirmationResult: ConfirmationResult, code: string) {
  const credential = await confirmationResult.confirm(code);
  return credential.user as FirebaseUser;
}

export function resetRecaptcha() {
  if (recaptchaVerifier) {
    try {
      // @ts-ignore
      recaptchaVerifier.clear && recaptchaVerifier.clear();
    } catch {}
  }
  recaptchaVerifier = null;
}

export type { ConfirmationResult };
