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