self.addEventListener('install', (event) => {
    console.log('Service Worker sedang diinstal...');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker sedang diaktifkan...');
});
