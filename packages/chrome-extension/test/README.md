# Chrome Extension Tests

This directory contains unit tests for the Vue Grab Chrome extension.

## Test Framework

We use **Vitest** with **happy-dom** to test the extension's functionality. The Chrome API is mocked using custom mocks defined in `setup.js`.

## Running Tests

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Test Structure

### Setup (`setup.js`)

Creates mocks for the Chrome API:
- `chrome.storage.sync.get` and `chrome.storage.sync.set`
- `chrome.runtime.getURL`
- `chrome.tabs.query` and `chrome.tabs.reload`

These mocks are reset before each test to ensure test isolation.

### Content Script Tests (`content.test.js`)

Tests for `src/content.js`:

1. **Injection Prevention**
   - Skips injection if already injected
   - Skips injection if disabled in settings

2. **Script Injection**
   - Injects script with default settings
   - Injects script with custom adapter (cursor)
   - Injects script with custom hotkey
   - Sets correct data attributes based on settings

3. **Edge Cases**
   - Uses default values from chrome.storage.sync.get
   - Injects into document.documentElement if no head exists
   - Removes script tag after load

### Popup Script Tests (`popup.test.js`)

Tests for `src/popup.js`:

1. **Loading Settings**
   - Loads settings on DOMContentLoaded
   - Loads default settings when none are saved
   - Calls chrome.storage.sync.get with correct defaults

2. **Saving Settings**
   - Saves settings when save button is clicked
   - Saves all field types correctly (boolean, string, number)
   - Shows success message after save
   - Hides success message after 2 seconds
   - Reloads active tab after save
   - Doesn't reload if no active tab exists

## Test Coverage

Run `pnpm test:coverage` to see coverage report. Current coverage includes:
- Content script injection logic
- Popup settings loading and saving
- Chrome API interactions
- Edge case handling

## Known Warnings

You may see warnings like:
```
Failed to fetch from "chrome-extension://fake-id/vue-grab.js": URL scheme "chrome-extension" is not supported.
```

These are **expected** and can be ignored. They occur because happy-dom tries to fetch the scripts, but since we're in a test environment (not a real browser), these URLs don't exist. The tests still pass because we're testing the logic, not the actual resource loading.

## Adding New Tests

To add new tests:

1. Create a new `.test.js` file in this directory
2. Import the necessary testing utilities from vitest
3. Use the global `chrome` object (provided by `setup.js`) for mocking Chrome APIs
4. Write your tests following the existing patterns

Example:

```javascript
import { describe, it, expect } from 'vitest';

describe('My New Feature', () => {
  it('should do something', () => {
    // Arrange
    chrome.storage.sync.get.mockImplementation((defaults, callback) => {
      callback({ enabled: true });
    });

    // Act
    // ... your code

    // Assert
    expect(chrome.storage.sync.get).toHaveBeenCalled();
  });
});
```

## Debugging Tests

To debug failing tests:

1. Use `console.log()` in your tests
2. Run tests in watch mode: `pnpm test:watch`
3. Check mock call counts with: `expect(chrome.api.method).toHaveBeenCalledTimes(n)`
4. Inspect mock call arguments with: `expect(chrome.api.method).toHaveBeenCalledWith(...)`
