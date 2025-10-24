import { Code } from '@/components/code';

export default async function Home() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <Code
          code={`import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`}
          lang="tsx"
        />

        <Code
          code={`const greeting = "Hello, world!";
const numbers = [1, 2, 3, 4, 5];

function sum(a, b) {
  return a + b;
}`}
          lang="javascript"
          showLineNumbers
        />

        <Code
          code={`async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}`}
          lang="typescript"
        />
      </div>
    </div>
  );
}
