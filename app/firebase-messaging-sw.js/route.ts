import { NextResponse } from 'next/server';

export async function GET() {
  const scriptContent = `
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}",
    authDomain: "${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}",
    projectId: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}",
    storageBucket: "${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID}"
});

const messaging = firebase.messaging();

// Force the installing service worker to activate immediately.
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Once activated, immediately take control of the page
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

messaging.onBackgroundMessage((payload) => {

    // Preference: Use notification object if present, fallback to data
    const title = payload.notification?.title || payload.data?.title || "New Message";
    const body = payload.notification?.body || payload.data?.body || "";

    const notificationOptions = {
        body: body,
        icon: payload.notification?.icon || payload.data?.icon || '/icons/icon-192x192.png',
        image: payload.notification?.icon || payload.data?.icon,
        badge: '/icons/icon-192x192.png',
        data: payload.data,
        tag: payload.notification?.tag || payload.data?.tag || payload.data?.type || 'general',
        renotify: true,
        vibrate: [200, 100, 200],
        actions: [
            { action: 'open', title: 'Open OneCamp' }
        ]
    };

    self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const data = event.notification.data;
    let urlToOpen = '/app';

    // Redirection logic based on notification type
    if (data) {
        if (data.type === 'chat' || data.type === 'chat_reaction' || data.type === 'chat_comment') {
            urlToOpen = \`/app/chat/\${data.thread_id}\`;
        } else if (data.type === 'task' || data.type === 'task_comment' || data.type === 'task_reaction') {
            urlToOpen = \`/app/tasks/\${data.thread_id}\`;
        } else if (data.type === 'channel' || data.type === 'post_comment') {
            urlToOpen = \`/app/channel/\${data.type_id}/\${data.thread_id}\`;
        }
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // 1. Check if there's already a tab open with this URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            // 2. If not, open a new tab
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
`;

  return new NextResponse(scriptContent, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
