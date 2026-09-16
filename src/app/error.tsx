"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="not-found section-shell">
      <span className="eyebrow">UNEXPECTED INTERRUPTION</span>
      <h1>
        Let’s try
        <br />
        <span>that again.</span>
      </h1>
      <p>Something interrupted this page.</p>
      <Button onClick={reset}>Retry page</Button>
    </main>
  );
}
