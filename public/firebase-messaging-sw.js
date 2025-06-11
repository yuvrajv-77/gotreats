importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyD4dHHjOVadAQgKxJjyZiTgZNDOKesLSp4",
    authDomain: "chanda-home-essentials.firebaseapp.com",
    projectId: "chanda-home-essentials",
    messagingSenderId: "252729417304",
    appId:"1:252729417304:web:464a826ff50c8840ae342d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: '/favicon.png'
    });
});