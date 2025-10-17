# react-grab

Put this in your `layout.tsx` file:

```jsx
import { Script } from "next/script";

<head>
{process.env.NODE_ENV === "development" && (
  <Script
    src="//unpkg.com/react-grab@0.0.7/dist/index.global.js"
    crossOrigin="anonymous"
    strategy="beforeInteractive"
  />
)}
</head>
```