import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the popup HTML and JS
const popupHtmlPath = path.join(__dirname, '../src/popup.html');
const popupJsPath = path.join(__dirname, '../src/popup.js');
const popupHtml = fs.readFileSync(popupHtmlPath, 'utf8');
const popupJs = fs.readFileSync(popupJsPath, 'utf8');

describe('Popup Script', () => {
  let originalDocument;

  beforeEach(() => {
    // Reset the DOM with the popup HTML
    document.open();
    document.write(popupHtml);
    document.close();

    // Mock chrome.storage.sync.get
    chrome.storage.sync.get.mockImplementation((defaults, callback) => {
      callback(defaults);
    });

    // Mock chrome.storage.sync.set
    chrome.storage.sync.set.mockImplementation((data, callback) => {
      if (callback) callback();
    });

    // Mock chrome.tabs.query
    chrome.tabs.query.mockImplementation((query, callback) => {
      callback([{ id: 123 }]);
    });

    // Mock chrome.tabs.reload
    chrome.tabs.reload.mockImplementation((tabId, callback) => {
      if (callback) callback();
    });
  });

  describe('Loading Settings', () => {
    it('should load settings on DOMContentLoaded', async () => {
      // Mock storage with custom settings
      chrome.storage.sync.get.mockImplementation((defaults, callback) => {
        callback({
          enabled: false,
          adapter: 'cursor',
          hotkey: 'Alt,G',
          keyHoldDuration: '300'
        });
      });

      // Execute the popup script
      eval(popupJs);

      // Trigger DOMContentLoaded
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // Wait a tick for the callback
      await new Promise(resolve => setTimeout(resolve, 0));

      // Check that the form was populated
      expect(document.getElementById('enabled').checked).toBe(false);
      expect(document.getElementById('adapter').value).toBe('cursor');
      expect(document.getElementById('hotkey').value).toBe('Alt,G');
      expect(document.getElementById('keyHoldDuration').value).toBe('300');
    });

    it('should load default settings when no settings are saved', async () => {
      // Execute the popup script
      eval(popupJs);

      // Trigger DOMContentLoaded
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // Wait a tick
      await new Promise(resolve => setTimeout(resolve, 0));

      // Check that defaults were loaded
      expect(document.getElementById('enabled').checked).toBe(true);
      expect(document.getElementById('adapter').value).toBe('none');
      expect(document.getElementById('hotkey').value).toBe('Meta,C');
      expect(document.getElementById('keyHoldDuration').value).toBe('500');
    });

    it('should call chrome.storage.sync.get with correct defaults', async () => {
      // Execute the popup script
      eval(popupJs);

      // Trigger DOMContentLoaded
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);

      // Wait a tick
      await new Promise(resolve => setTimeout(resolve, 0));

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
  });

  describe('Saving Settings', () => {
    beforeEach(async () => {
      // Execute the popup script and trigger DOMContentLoaded
      eval(popupJs);
      const event = new Event('DOMContentLoaded');
      document.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    it('should save settings when save button is clicked', async () => {
      // Set form values
      document.getElementById('enabled').checked = false;
      document.getElementById('adapter').value = 'cursor';
      document.getElementById('hotkey').value = 'Alt,G';
      document.getElementById('keyHoldDuration').value = '300';

      // Click save button
      const saveButton = document.getElementById('save');
      saveButton.click();

      // Wait a tick
      await new Promise(resolve => setTimeout(resolve, 0));

      // Check that chrome.storage.sync.set was called with correct values
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        {
          enabled: false,
          adapter: 'cursor',
          hotkey: 'Alt,G',
          keyHoldDuration: '300'
        },
        expect.any(Function)
      );
    });

    it('should show success message after save', async () => {
      const status = document.getElementById('status');
      expect(status.classList.contains('success')).toBe(false);

      // Click save
      document.getElementById('save').click();

      // Wait a tick
      await new Promise(resolve => setTimeout(resolve, 0));

      // Status should have success class
      expect(status.classList.contains('success')).toBe(true);
    });

    it('should hide success message after 2 seconds', async () => {
      vi.useFakeTimers();

      const status = document.getElementById('status');

      // Click save
      document.getElementById('save').click();

      // Fast-forward through pending promises
      await Promise.resolve();

      // Success class should be present
      expect(status.classList.contains('success')).toBe(true);

      // Fast-forward time
      vi.advanceTimersByTime(2000);

      // Success class should be removed
      expect(status.classList.contains('success')).toBe(false);

      vi.useRealTimers();
    });

    it('should reload active tab after save', async () => {
      // Click save
      document.getElementById('save').click();

      // Wait a tick
      await new Promise(resolve => setTimeout(resolve, 0));

      // Check that tabs.query was called
      expect(chrome.tabs.query).toHaveBeenCalledWith(
        { active: true, currentWindow: true },
        expect.any(Function)
      );

      // Check that tabs.reload was called with the tab ID
      expect(chrome.tabs.reload).toHaveBeenCalledWith(123);
    });

    it('should not reload if no active tab', async () => {
      // Mock tabs.query to return no tabs
      chrome.tabs.query.mockImplementation((query, callback) => {
        callback([]);
      });

      // Click save
      document.getElementById('save').click();

      // Wait a tick
      await new Promise(resolve => setTimeout(resolve, 0));

      // tabs.reload should not be called
      expect(chrome.tabs.reload).not.toHaveBeenCalled();
    });

    it('should save all field types correctly', async () => {
      // Set various values
      document.getElementById('enabled').checked = true; // boolean
      document.getElementById('adapter').value = 'none'; // string select
      document.getElementById('hotkey').value = 'Meta,X'; // string input
      document.getElementById('keyHoldDuration').value = '1000'; // number input

      // Click save
      document.getElementById('save').click();

      // Wait a tick
      await new Promise(resolve => setTimeout(resolve, 0));

      // Verify all values were saved correctly
      expect(chrome.storage.sync.set).toHaveBeenCalledWith(
        {
          enabled: true,
          adapter: 'none',
          hotkey: 'Meta,X',
          keyHoldDuration: '1000'
        },
        expect.any(Function)
      );
    });
  });
});
