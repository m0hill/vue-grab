# <img src="https://react-grab.com/favicon.png" width="60" align="center" /> react-grab

[![size](https://img.shields.io/bundlephobia/minzip/react-grab?label=gzip&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/package/react-grab)
[![version](https://img.shields.io/npm/v/react-grab?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/react-grab)
[![downloads](https://img.shields.io/npm/dt/react-grab.svg?style=flat&colorA=000000&colorB=000000)](https://npmjs.com/package/react-grab)

react-grab is a toolkit to **hack into react internals**

by default, you cannot access react internals. bippy bypasses this by "pretending" to be react devtools, giving you access to the fiber tree and other internals.

- works outside of react – no react code modification needed
- utility functions that work across modern react (v17-19)
- no prior react source code knowledge required

```jsx
import { onCommitFiberRoot, traverseFiber } from "bippy"; // must be imported BEFORE react

onCommitFiberRoot((root) => {
  traverseFiber(root.current, (fiber) => {
    // prints every fiber in the current React tree
    console.log("fiber:", fiber);
  });
});
```

# react-grab

Inspect React components and copy their source file paths to clipboard.

## Install

```bash
npm install react-grab
# or
pnpm add react-grab
# or
yarn add react-grab
```

## Usage

### Next.js (App Router)

Add to your `app/layout.tsx`:

```jsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab@0.0.7/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### How it works

1. Hold **Cmd** (Mac) for ~1 second to activate
2. Hover over any element on the page
3. Click to copy component stack trace and HTML to clipboard
