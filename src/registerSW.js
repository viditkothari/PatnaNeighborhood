/* 
  One step to improve user experience in web development is to ensure that a web app is
  usable enough even in offline state to do which we register a service worker to serve
  assets from local cache. This lets the app load faster on subsequent visits in production,
  and gives
*/

const isLocalhost = Boolean(
  window.location.hostname === 'localhost'
    // Check for IPv6
    || window.location.hostname === '[::1]'
    // Check for IPv4.
    || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
);

export default function register() {
  if ('serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicURL = new URL(process.env.PUBLIC_URL, window.location);
    if (publicURL.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const serviceWorkerURL = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Checking if a service worker still exists or not.
        checkValidServiceWorker(serviceWorkerURL);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served by a service worker.'
          );
        });
      } else {
        // If it isn't a local host register service worker
        registerValidSW(serviceWorkerURL);
      }
    });
  }
}

function registerValidSW(serviceWorkerURL) {
  navigator.serviceWorker
    .register(serviceWorkerURL)
    .then((registration) => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      if (!navigator.serviceWorker.controller) {
        return;
      }

      // Check if there is a worker in paused state then informing the user about update
      if (registration.waiting) {
        updateReady(registration.waiting);
        return;
      }

      // If service worker is installing, then track it's state
      if (registration.installing) {
        const installingWorker = registration.installing;
        trackInstalling(installingWorker);
        return;
      }

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        trackInstalling(installingWorker);
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });

  /**
   * Fires when the service worker controlling this page changes
   */
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

function checkValidServiceWorker(serviceWorkerURL) {
  // Check if the service worker is valid.
  fetch(serviceWorkerURL)
    .then((response) => {
      if (
        response.status === 404
        || response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(serviceWorkerURL);
      }
    })
    .catch(() => {
      console.log('No internet connection found. Offline mode ON.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

/**
 * Listening for the 'installing' serviceWorker state & inform the user any update
 */
function trackInstalling(installingWorker) {
  installingWorker.addEventListener('statechange', () => {
    if (installingWorker.state === 'installed') {
      if (navigator.serviceWorker.controller) {
        console.log('New content is available; please refresh.');
        updateReady(installingWorker);
      } else {
        console.log('Content is cached for offline use.');
      }
    }
  });
}

function updateReady(worker) {
  let userConsent = false;
  userConsent = window.confirm('New version available. Do you want to update?');
  if (!userConsent) return;
  worker.postMessage('updateSW');
}