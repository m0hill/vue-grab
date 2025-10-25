# Vue Grab Chrome Extension

A Chrome extension that automatically injects [Vue Grab](https://github.com/m0hill/vue-grab) into web pages, allowing you to grab any element in Vue applications.

## Features

- Automatically injects Vue Grab into all web pages
- Configurable settings through extension popup
- Toggle on/off per your needs
- Configure hotkey, adapter, and hold duration
- Works with Cursor, Claude Code, and other AI coding assistants

## Installation

### From Source

1. Build the vue-grab library first:
   ```bash
   pnpm --filter vue-grab build
   ```

2. Build the Chrome extension:
   ```bash
   pnpm --filter chrome-extension build
   ```

3. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `packages/chrome-extension/dist` directory

## Usage

1. After installing, the extension will automatically inject Vue Grab into all web pages
2. Click the extension icon to configure settings:
   - **Enable/Disable**: Toggle Vue Grab on or off
   - **Adapter**: Choose which tool to open (Cursor or none)
   - **Hotkey**: Set the keyboard shortcut (default: Meta,C)
   - **Hold Duration**: Set how long to hold the key (default: 500ms)

3. On any page with a Vue app:
   - Hold the configured hotkey (default: Cmd+C on Mac, Ctrl+C on Windows)
   - Click on any element to grab it
   - The element's HTML and Vue component info will be copied to your clipboard

## Configuration

Default settings:
- **Enabled**: true
- **Adapter**: none (clipboard only)
- **Hotkey**: Meta,C (Cmd+C on Mac)
- **Hold Duration**: 500ms

You can change these settings anytime through the extension popup.

## Development

The extension consists of:
- `manifest.json`: Extension configuration
- `src/content.js`: Content script that injects Vue Grab
- `src/popup.html` & `src/popup.js`: Settings UI
- `build.js`: Build script
- `test/`: Test files

To rebuild after changes:
```bash
pnpm --filter chrome-extension build
```

Then reload the extension in Chrome (click the refresh icon on the extension card).

### Testing

The extension includes comprehensive unit tests using Vitest:

```bash
# Run tests once
pnpm --filter chrome-extension test

# Run tests in watch mode
pnpm --filter chrome-extension test:watch

# Run tests with coverage
pnpm --filter chrome-extension test:coverage
```

Tests cover:
- Content script injection logic
- Popup settings loading and saving
- Chrome API interactions
- Edge cases and error handling

See [test/README.md](test/README.md) for more details.

## How It Works

1. The content script (`content.js`) runs on all web pages
2. It loads settings from Chrome's storage API
3. It injects the Vue Grab script (`vue-grab.js`) with configured attributes
4. Vue Grab initializes and starts listening for the hotkey
5. When you grab an element, it copies the info to your clipboard

## Icons

To add custom icons, create the following PNG files in `dist/icons/`:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

Suggested design: Green background (#4CAF50) with white "VG" text.

## License

MIT
