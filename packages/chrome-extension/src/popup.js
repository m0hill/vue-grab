// Popup script for Vue Grab extension settings

// Load saved settings
document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get({
    enabled: true,
    adapter: 'none',
    hotkey: 'Meta,C',
    keyHoldDuration: '500'
  }, function(settings) {
    document.getElementById('enabled').checked = settings.enabled;
    document.getElementById('adapter').value = settings.adapter;
    document.getElementById('hotkey').value = settings.hotkey;
    document.getElementById('keyHoldDuration').value = settings.keyHoldDuration;
  });
});

// Save settings
document.getElementById('save').addEventListener('click', function() {
  const enabled = document.getElementById('enabled').checked;
  const adapter = document.getElementById('adapter').value;
  const hotkey = document.getElementById('hotkey').value;
  const keyHoldDuration = document.getElementById('keyHoldDuration').value;

  chrome.storage.sync.set({
    enabled: enabled,
    adapter: adapter,
    hotkey: hotkey,
    keyHoldDuration: keyHoldDuration
  }, function() {
    // Show success message
    const status = document.getElementById('status');
    status.classList.add('success');
    setTimeout(function() {
      status.classList.remove('success');
    }, 2000);

    // Reload active tab to apply new settings
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  });
});
