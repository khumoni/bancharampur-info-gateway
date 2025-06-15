
// [FCM Service Worker]

// Give up early if firebase messaging is not available
if (typeof importScripts === 'function') {
  importScripts('https://www.gstatic.com/firebasejs/11.9.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/11.9.0/firebase-messaging-compat.js');

  // Initialize Firebase app in the service worker with same config as your app
  firebase.initializeApp({
    apiKey: "AIzaSyCjykrq-gEwdzuCkbi-T0V0U5xrY9mH3P4",
    authDomain: "bancharampur-digital-infoguide.firebaseapp.com",
    databaseURL: "https://bancharampur-digital-infoguide-default-rtdb.firebaseio.com",
    projectId: "bancharampur-digital-infoguide",
    storageBucket: "bancharampur-digital-infoguide.firebasestorage.app",
    messagingSenderId: "342061327201",
    appId: "1:342061327201:web:4afbeb2e98d7527f0fdb20",
    measurementId: "G-930S3VS499"
  });

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(function(payload) {
    // Customize notification here
    const { title, body, icon } = payload.notification || {};
    self.registration.showNotification(title || "Notification", {
      body: body || "",
      icon: icon || "/favicon.ico"
    });
  });
}
