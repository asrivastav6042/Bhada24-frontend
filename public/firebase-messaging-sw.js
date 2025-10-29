importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Use the same firebase config as the app
const firebaseConfig = {
  apiKey: 'AIzaSyBTtN4eYCdc1_IybkSi7EIU1br52rZy2To',
  authDomain: 'bhada24-96846.firebaseapp.com',
  projectId: 'bhada24-96846',
  storageBucket: 'bhada24-96846.firebasestorage.app',
  messagingSenderId: '200383906913',
  appId: '1:200383906913:web:48a06fb49870731f045620',
  measurementId: 'G-SW8DZ4PZT6',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notification = payload.notification || payload.data || {};
  const title = notification.title || 'Notification';
  const options = {
    body: notification.body || notification.message || '',
    data: payload.data || {},
    // include icon if available
    icon: notification.icon || '/favicon.ico',
  };

  // Show the notification
  self.registration.showNotification(title, options);

  // Inform open clients about the incoming message so they can persist it locally
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
    for (const client of clients) {
      try {
        client.postMessage({ type: 'FCM_BACKGROUND_MESSAGE', payload });
      } catch (e) {
        // ignore
      }
    }
  });
});

// optional: handle notificationclick to focus/open the app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const urlToOpen = event.notification?.data?.click_action || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
