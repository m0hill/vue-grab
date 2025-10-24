# CDN Examples - No Build Tools Required

These examples demonstrate using vue-grab with Vue loaded from CDN (no Vite, Webpack, or any build tools).

## Files

- **`vue3-cdn.html`** - Vue 3 + vue-grab via CDN
- **`vue2-cdn.html`** - Vue 2 + vue-grab via CDN

## How to Run

Simply open the HTML files in your browser:

```bash
# Option 1: Double-click the file
open vue3-cdn.html
open vue2-cdn.html

# Option 2: Use a simple HTTP server
python3 -m http.server 8000
# Then open http://localhost:8000/vue3-cdn.html
```

## Usage

Hold **⌘C** (Mac) or **Ctrl+C** (Windows/Linux) for 500ms, then hover and click any element to inspect it with vue-grab!

## Key Points

1. **Load vue-grab BEFORE Vue** - This is critical for proper instrumentation
2. **No build step required** - Just plain HTML + script tags
3. **Works with any Vue version** - Vue 2, Vue 2.7, Vue 3
4. **Production ready** - Uses the published package from unpkg
