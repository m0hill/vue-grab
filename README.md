# <img src="https://react-grab.com/logo.svg" width="60" align="center" /> React Grab

[![size](https://img.shields.io/bundlephobia/minzip/react-grab?label=gzip&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/package/react-grab)
[![version](https://img.shields.io/npm/v/react-grab?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/react-grab)
[![downloads](https://img.shields.io/npm/dt/react-grab.svg?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/react-grab)

Copy elements on your app and as context for Cursor, Claude Code, etc.

By default, Cursor, Claude Code, etc. cannot access elements on your page. React Grab allows you to tell them what part of your app you want to change.

With React Grab:

- Hold <kbd>⌘C</kbd> and click on any element on your page
- Works with Cursor, Claude Code, OpenCode
- Just a single script tag (it’s just JavaScript!)

### Next.js (App router)

Add this inside of your `app/layout.tsx`:

```jsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* put this in the <head> */}
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
            data-enabled="true"
          />
        )}
        {/* rest of your scripts go under */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Next.js (Pages router)

Add this into your `pages/_document.tsx`:

```jsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* put this in the <Head> */}
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
            data-enabled="true"
          />
        )}
        {/* rest of your scripts go under */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### Vite

Add this into your root `vite.config.ts`:

```ts
// ...
import { reactGrab } from "react-grab/plugins/vite";

export default defineConfig({
  plugins: [
    // add react grab as a plugin
    reactGrab(),
  ],
});
```

### Script tag

Add this anywhere in your app:

```html
<script src="//unpkg.com/react-grab/dist/index.global.js" crossorigin="anonymous" data-enabled="true"></script>
```