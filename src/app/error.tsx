"use client";

import { copy } from "@/lib/copy";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="not-found section-shell">
      <span className="eyebrow">{copy.error.label}</span>
      <h1>
        {copy.error.title[0]}
        <br />
        <span>{copy.error.title[1]}</span>
      </h1>
      <p>{copy.error.description}</p>
      <Button onClick={reset}>{copy.error.retry}</Button>
    </main>
  );
}
