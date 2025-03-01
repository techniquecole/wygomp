function calculateTripCost() {
    var distance = parseFloat(document.getElementById('distance').value);
    var fuelEfficiency = parseFloat(document.getElementById('fuel_efficiency').value);
    var pricePerGallon = parseFloat(document.getElementById('price_per_gallon').value);

    if (isNaN(distance) || isNaN(fuelEfficiency) || isNaN(pricePerGallon) || distance <= 0 || fuelEfficiency <= 0 || pricePerGallon <= 0) {
        alert("Please, Enter Correct Data within the fields.");
        return;
    }

    var gallonsNeeded = distance / fuelEfficiency;
    var totalCost = gallonsNeeded * pricePerGallon;

    document.getElementById('gallons_needed').innerText = gallonsNeeded.toFixed(2) + " gallons";
    document.getElementById('total_cost').innerText = "$" + totalCost.toFixed(2);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
// filepath: /service-worker.js
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('my-cache').then(cache => {
            return cache.addAll([
                '/index.html',
                '/styles.css',
                '/script.js',
                '/offline.html'
            ]);
        })
    );
});
// filepath: /service-worker.js
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                return caches.match('/offline.html');
            });
        })
    );
});
// filepath: /service-worker.js
self.addEventListener('activate', event => {
    const cacheWhitelist = ['my-cache'];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
