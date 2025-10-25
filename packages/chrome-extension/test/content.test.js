import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the content script
const contentScriptPath = path.join(__dirname, '../src/content.js');
const contentScript = fs.readFileSync(contentScriptPath, 'utf8');

describe('Content Script', () => {
  beforeEach(() => {
    // Reset the DOM
    document.head.innerHTML = '';
    document.body.innerHTML = '';

    // Reset window flags
    delete window.__VUE_GRAB_INJECTED__;

    // Setup chrome.runtime.getURL mock
    chrome.runtime.getURL.mockImplementation((path) => `chrome-extension://fake-id/${path}`);
  });

  it('should skip injection if already injected', () => {
    // Mark as already injected
    window.__VUE_GRAB_INJECTED__ = true;

    // Execute the script
    eval(contentScript);

    // chrome.storage.sync.get should not be called
    expect(chrome.storage.sync.get).not.toHaveBeenCalled();
  });

  it('should set injected flag', () => {
    // Mock storage response
    chrome.storage.sync.get.mockImplementation((defaults, callback) => {
      callback({ enabled: false }); // Disabled so we can test just the flag
    });

    expect(window.__VUE_GRAB_INJECTED__).toBeUndefined();

    // Execute the script
    eval(contentScript);

    expect(window.__VUE_GRAB_INJECTED__).toBe(true);
  });

  it('should skip injection if disabled in settings', () => {
    // Mock storage to return disabled
    chrome.storage.sync.get.mockImplementation((defaults, callback) => {
      callback({ enabled: false });
    });

    // Execute the script
    eval(contentScript);

    // Wait for async callback
    expect(chrome.storage.sync.get).toHaveBeenCalled();

    // No script should be added to the document
    const scripts = document.querySelectorAll('script');
    expect(scripts.length).toBe(0);
  });

  it('should inject script with default settings', () => {
    // Mock storage to return default settings
    chrome.storage.sync.get.mockImplementation((defaults, callback) => {
      callback({
        enabled: true,
        adapter: 'none',
        hotkey: 'Meta,C',
        keyHoldDuration: '500'
      });
    });

    // Execute the script
    eval(contentScript);

    // Check that script was injected
    const scripts = document.head.querySelectorAll('script');
    expect(scripts.length).toBe(1);

    const script = scripts[0];
    expect(script.src).toBe('chrome-extension://fake-id/vue-grab.js');
    expect(script.getAttribute('data-enabled')).toBe('true');
    expect(script.getAttribute('data-hotkey')).toBe('Meta,C');
    expect(script.getAttribute('data-key-hold-duration')).toBe('500');
    expect(script.getAttribute('crossorigin')).toBe('anonymous');

    // Should not set adapter if it's 'none'
    expect(script.getAttribute('data-adapter')).toBeNull();
  });

  it('should inject script with cursor adapter', () => {
    // Mock storage to return cursor adapter
    chrome.storage.sync.get.mockImplementation((defaults, callback) => {
      callback({
        enabled: true,
        adapter: 'cursor',
        hotkey: 'Meta,C',
        keyHoldDuration: '500'
      });
    });

    // Execute the script
    eval(contentScript);

    const script = document.head.querySelector('script');
    expect(script.getAttribute('data-adapter')).toBe('cursor');
  });

  it('should inject script with custom hotkey', () => {
    // Mock storage with custom hotkey
    chrome.storage.sync.get.mockImplementation((defaults, callback) => {
      callback({
        enabled: true,
        adapter: 'none',
        hotkey: 'Alt,G',
        keyHoldDuration: '300'
      });
    });

    // Execute the script
    eval(contentScript);

    const script = document.head.querySelector('script');
    expect(script.getAttribute('data-hotkey')).toBe('Alt,G');
    expect(script.getAttribute('data-key-hold-duration')).toBe('300');
  });

  it('should remove script tag after load', () => {
    // Mock storage
    chrome.storage.sync.get.mockImplementation((defaults, callback) => {
      callback({
        enabled: true,
        adapter: 'none',
        hotkey: 'Meta,C',
        keyHoldDuration: '500'
      });
    });

    // Execute the script
    eval(contentScript);

    const script = document.head.querySelector('script');
    expect(script).toBeTruthy();

    // Trigger the onload event
    script.onload();

    // Script should be removed
    const scriptsAfterLoad = document.head.querySelectorAll('script');
    expect(scriptsAfterLoad.length).toBe(0);
  });

  it('should use default values from chrome.storage.sync.get', () => {
    // Mock storage to call callback with the defaults (simulating no stored values)
    chrome.storage.sync.get.mockImplementation((defaults, callback) => {
      callback(defaults);
    });

    // Execute the script
    eval(contentScript);

    // Verify the defaults were used
    expect(chrome.storage.sync.get).toHaveBeenCalledWith(
      {
        enabled: true,
        adapter: 'none',
        hotkey: 'Meta,C',
        keyHoldDuration: '500'
      },
      expect.any(Function)
    );
  });

  it('should inject into document.documentElement if no head exists', () => {
    // Remove the head
    const head = document.head;
    head.remove();

    // Mock storage
    chrome.storage.sync.get.mockImplementation((defaults, callback) => {
      callback({
        enabled: true,
        adapter: 'none',
        hotkey: 'Meta,C',
        keyHoldDuration: '500'
      });
    });

    // Execute the script
    eval(contentScript);

    // Script should be in documentElement
    const script = document.documentElement.querySelector('script');
    expect(script).toBeTruthy();
    expect(script.src).toBe('chrome-extension://fake-id/vue-grab.js');
  });
});
