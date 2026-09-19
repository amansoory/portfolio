export function ProjectDemo({ url, name }: { url: string; name: string }) {
  return <section className="project-live-demo" aria-label={`${name} live demo`}>
    <h2>Try the live app</h2>
    <p>The screenshot above shows the app. Open the live demo to play, compare bots, and inspect their decisions. It opens in its own tab so the boards have room.</p>
    <a href={url} target="_blank" rel="noopener noreferrer">Open interactive demo ↗</a>
    <a href="https://jev-2048.vercel.app/research" target="_blank" rel="noopener noreferrer">Read methods and results ↗</a>
  </section>;
}
