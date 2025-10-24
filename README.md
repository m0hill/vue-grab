# <img src="https://react-grab.com/logo.svg" width="60" align="center" /> React Grab

[![size](https://img.shields.io/bundlephobia/minzip/react-grab?label=gzip&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/package/react-grab)
[![version](https://img.shields.io/npm/v/react-grab?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/react-grab)
[![downloads](https://img.shields.io/npm/dt/react-grab.svg?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/react-grab)

> [**Install in Cursor**](https://cursor.com/link/prompt?text=These+are+the+installation+instructions+for+React+Grab.+Follow+the+instructions+to+install+%28based+on+the+framework+used+in+this+codebase%29%0A%0Ahttps%3A%2F%2Fraw.githubusercontent.com%2Faidenybai%2Freact-grab%2Frefs%2Fheads%2Fmain%2FREADME.md)

Grab any element on in your app and give it to Cursor, Claude Code, etc. to change.

By default coding agents cannot access elements on your page. React Grab fixes this - just point and click to provide context!

- Hold <kbd>⌘C</kbd> and click on any element on your page
- Works with Cursor, Claude Code, OpenCode
- Just a single script tag (it’s just JavaScript!)

### [Try out a demo! →](https://react-grab.com)

![React Grab Demo](https://react-grab.com/demo.gif)

## Install

> [**Install in Cursor**](https://cursor.com/link/prompt?text=These+are+the+installation+instructions+for+React+Grab.+Follow+the+instructions+to+install+%28based+on+the+framework+used+in+this+codebase%29%0A%0Ahttps%3A%2F%2Fraw.githubusercontent.com%2Faidenybai%2Freact-grab%2Frefs%2Fheads%2Fmain%2FREADME.md)

Get started in 1 minute by adding this script tag to your app:

```html
<script
  src="//unpkg.com/react-grab/dist/index.global.js"
  crossorigin="anonymous"
  data-enabled="true"
></script>
```

If you're using a React framework or build tool, view instructions below:

#### Next.js (App router)

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

#### Next.js (Pages router)

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

#### Vite

1. Run `npm i react-grab@latest`
2. Add this to your `vite.config.ts`:

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

## Resources & Contributing Back

Want to try it out? Check the [our demo](https://react-grab.com).

Looking to contribute back? Check the [Contributing Guide](https://github.com/aidenybai/react-grab/blob/main/CONTRIBUTING.md) out.

Want to talk to the community? Hop in our [Discord](https://discord.com/invite/G7zxfUzkm7) and share your ideas and what you've build with React Grab.

Find a bug? Head over to our [issue tracker](https://github.com/aidenybai/react-grab/issues) and we'll do our best to help. We love pull requests, too!

We expect all contributors to abide by the terms of our [Code of Conduct](https://github.com/aidenybai/react-grab/blob/main/.github/CODE_OF_CONDUCT.md).

[**→ Start contributing on GitHub**](https://github.com/aidenybai/react-grab/blob/main/CONTRIBUTING.md)

### License

React Grab is MIT-licensed open-source software.
