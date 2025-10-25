// Content script that injects vue-grab into the page
(function() {
  'use strict';

  // Check if vue-grab is already injected
  if (window.__VUE_GRAB_INJECTED__) {
    return;
  }
  window.__VUE_GRAB_INJECTED__ = true;

  // Get settings from storage
  chrome.storage.sync.get({
    enabled: true,
    adapter: 'none',
    hotkey: 'Meta,C',
    keyHoldDuration: '500'
  }, function(settings) {
    if (!settings.enabled) {
      return;
    }

    // Create and inject the script element
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('vue-grab.js');
    script.setAttribute('data-enabled', 'true');

    if (settings.adapter && settings.adapter !== 'none') {
      script.setAttribute('data-adapter', settings.adapter);
    }

    if (settings.hotkey) {
      script.setAttribute('data-hotkey', settings.hotkey);
    }

    if (settings.keyHoldDuration) {
      script.setAttribute('data-key-hold-duration', settings.keyHoldDuration);
    }

    script.setAttribute('crossorigin', 'anonymous');

    // Inject the script
    (document.head || document.documentElement).appendChild(script);

    // Remove the script tag after injection (the code is already running)
    script.onload = function() {
      script.remove();
    };
  });
})();
