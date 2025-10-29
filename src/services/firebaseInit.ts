import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBTtN4eYCdc1_IybkSi7EIU1br52rZy2To',
  authDomain: 'bhada24-96846.firebaseapp.com',
  projectId: 'bhada24-96846',
  storageBucket: 'bhada24-96846.firebasestorage.app',
  messagingSenderId: '200383906913',
  appId: '1:200383906913:web:48a06fb49870731f045620',
  measurementId: 'G-SW8DZ4PZT6',
};

export function initFirebaseApp() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }
  // if already initialized, return first app
  return getApps()[0];
}

export default initFirebaseApp;
