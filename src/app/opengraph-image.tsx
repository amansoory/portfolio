import { copy } from "@/lib/copy";
import { ImageResponse } from "next/og";
import { profile } from "@/lib/portfolio";

export const alt = copy.preview.alt;
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
        <span>
          {profile.initials}.DEV / {profile.role.toUpperCase()}
        </span>
        <span>{copy.preview.title}</span>
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
        <span>{copy.preview.lines[0]}</span>
        <span style={{ color: "#b6dca1" }}>{copy.preview.lines[1]}</span>
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
        <span>{copy.hero.path}</span>
      </div>
    </div>,
    size,
  );
}
