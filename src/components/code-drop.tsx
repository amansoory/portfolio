"use client";

import { useEffect, useRef, useState } from "react";

const MESSAGE = 'yourNextEngineer = "Arman";';

export function CodeDrop() {
  const [count, setCount] = useState(0);
  const [muted, setMuted] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const sessionRestore = useRef<(() => void) | null>(null);
  const complete = count === MESSAGE.length;

  useEffect(() => () => {
    void audio.current?.close().catch(() => {});
    audio.current = null;
    sessionRestore.current?.();
    sessionRestore.current = null;
  }, []);

  async function prepareAudio() {
    // iOS 17+ defaults Web Audio to ambient, which obeys the silent switch.
    // Request media playback only in response to an explicit sound interaction.
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session && !sessionRestore.current) {
      try {
        const previous = session.type;
        session.type = "playback";
        sessionRestore.current = () => { session.type = previous; };
      } catch {
        // Unsupported session types must not prevent normal Web Audio playback.
      }
    }
    const context = audio.current?.state !== "closed" && audio.current
      ? audio.current
      : new AudioContext();
    audio.current = context;
    // Resume both suspended and iOS-interrupted contexts on the next tap.
    if (context.state !== "running") await context.resume();
    return context;
  }

  async function playDrop(next: number) {
    if (muted) return;
    try {
      const context = await prepareAudio();
      if (context.state !== "running") return;

      function tone(frequency: number, delay: number, duration: number, falling = false, volume = 0.065) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = context.currentTime + delay;
        oscillator.type = falling ? "sine" : "triangle";
        oscillator.frequency.setValueAtTime(frequency, start);
        if (falling) oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.55, start + duration);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(volume, start + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.02);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      }

      // Low, rounded notes with a different pitch and decay on each tap.
      const notes = [196, 246.94, 164.81, 220, 293.66, 185, 261.63];
      const frequency = notes[(next - 1) % notes.length] * (0.97 + Math.random() * 0.06);
      const duration = 0.15 + Math.random() * 0.07;
      tone(frequency, 0, duration, true);
      tone(frequency * 1.5, 0.012, duration * 0.65, true, 0.018);
      if (next === MESSAGE.length) {
        [196, 246.94, 293.66, 392].forEach((note, index) => tone(note, 0.18 + index * 0.11, 0.3, false, 0.04));
      }
    } catch {
      // The interaction still works when audio is unavailable or blocked.
    }
  }

  async function playReset() {
    if (muted) return;
    try {
      const context = await prepareAudio();
      if (context.state !== "running") return;

      // Filtered, gently pulsing noise makes a short fabric brushing sound.
      const duration = 0.32;
      const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i++) {
        const flutter = 0.75 + 0.25 * Math.sin(i / context.sampleRate * Math.PI * 2 * 28);
        samples[i] = (Math.random() * 2 - 1) * flutter;
      }
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      const start = context.currentTime;
      source.buffer = buffer;
      filter.type = "lowpass";
      filter.Q.value = 0.5;
      filter.frequency.setValueAtTime(1500, start);
      filter.frequency.exponentialRampToValueAtTime(350, start + duration);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.13, start + 0.045);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      source.start(start);
      source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    } catch {
      // Reset remains available even if the browser cannot play audio.
    }
  }

  function drop() {
    if (complete) return;
    let next = Math.min(count + 1, MESSAGE.length);
    while (MESSAGE[next] === " ") next++;
    setCount(next);
    void playDrop(next);
  }

  return (
    <div className="about-art code-drop" data-complete={complete} data-lens="off">
      <div className="about-art-grid" aria-hidden="true" />
      <button
        type="button"
        className="code-drop-surface"
        onClick={drop}
        disabled={complete}
        aria-label="Drop next character"
        aria-describedby="code-drop-status"
      >
        <span className="code-drop-top" aria-hidden="true">A LITTLE CODE, ONE CLICK AT A TIME</span>
        <span className="code-drop-hint" aria-hidden="true">
          {complete ? "Let’s build something together." : count ? "Keep going. You’re building something." : "Click or tap to build something."}
        </span>
        <span className="code-drop-line" aria-hidden="true">
          {Array.from(MESSAGE).map((character, index) => (
            <span className="code-drop-slot" key={index}>
              {index < count && (
                <span className={`code-drop-character${character === " " ? " code-drop-space" : ""}`}>
                  {character === " " ? "\u00a0" : character}
                </span>
              )}
            </span>
          ))}
        </span>
        <span className="code-drop-floor" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="code-drop-sound"
        aria-label="Mute code drop sounds"
        aria-pressed={muted}
        onClick={() => {
          setMuted(!muted);
          if (!muted) {
            void audio.current?.close().catch(() => {});
            audio.current = null;
            sessionRestore.current?.();
            sessionRestore.current = null;
          }
        }}
      >
        Sound {muted ? "off" : "on"}
      </button>
      <p id="code-drop-status" className="code-drop-status" role="status">
        {complete ? `Complete — ${MESSAGE}` : `${count} / ${MESSAGE.length} characters`}
      </p>
      {count > 0 && (
        <button type="button" className="code-drop-reset" onClick={() => { setCount(0); void playReset(); }}>
          {complete ? "Run again" : "Reset"} <span aria-hidden="true">↻</span>
        </button>
      )}
    </div>
  );
}
