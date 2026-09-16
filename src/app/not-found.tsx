import { copy } from "@/lib/copy";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found section-shell">
      <span className="eyebrow">{copy.notFound.label}</span>
      <h1>
        {copy.notFound.title[0]}
        <br />
        <span>{copy.notFound.title[1]}</span>
      </h1>
      <p>{copy.notFound.description}</p>
      <Link href="/" className="primary-link">
        <ArrowLeft size={16} />
        {copy.links.home}
      </Link>
    </main>
  );
}
