import { ImageResponse } from "next/og";
import { profile } from "@/lib/portfolio";

export const alt = "From source to system. Software engineering portfolio.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#0b100e",
        color: "#ecede7",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "65px 80px",
        fontFamily: "sans-serif",
        border: "1px solid #334335",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#b6dca1",
          fontSize: 22,
        }}
      >
        <span>SE.DEV / SOFTWARE ENGINEER</span>
        <span>01 — PORTFOLIO</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 74,
          fontSize: 86,
          lineHeight: 1.05,
          letterSpacing: -5,
        }}
      >
        <span>From a line of code.</span>
        <span style={{ color: "#b6dca1" }}>To a world of possibility.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "auto",
          fontSize: 23,
          color: "#a1ada3",
        }}
      >
        <span>{profile.name}</span>
        <span>SOURCE → SYSTEM → IMPACT</span>
      </div>
    </div>,
    size,
  );
}
