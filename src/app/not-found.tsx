import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found section-shell">
      <span className="eyebrow">404 / ROUTE NOT FOUND</span>
      <h1>
        A small detour
        <br />
        <span>in the system.</span>
      </h1>
      <p>This page doesn’t exist. Let’s get back to the work.</p>
      <Link href="/" className="primary-link">
        <ArrowLeft size={16} />
        Back to home
      </Link>
    </main>
  );
}
