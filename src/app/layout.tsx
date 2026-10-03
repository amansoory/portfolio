import { copy } from "@/lib/copy";
import type { Metadata } from "next";
import { Exo_2, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/portfolio-ui";
import { CommandPalette } from "@/components/command-palette";
import { CircuitField } from "@/components/circuit-field";
import { TextLens } from "@/components/text-lens";
import { profile, siteDescription, siteUrl } from "@/lib/portfolio";

const displayFont = localFont({
  src: "./fonts/Pulsar-Original.otf",
  variable: "--font-pulsar",
  weight: "400",
  display: "swap",
});

const bodyFont = Exo_2({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const heroFont = IBM_Plex_Sans({
  variable: "--font-hero",
  subsets: ["latin"],
  display: "swap",
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl || "http://localhost:3000"),
  title: {
    default: `${profile.name} | ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description: siteDescription,
  robots: { index: !profile.draft, follow: !profile.draft },
  openGraph: {
    title: `${profile.name} | ${profile.role}`,
    description: siteDescription,
    type: "website",
    locale: "en_US",
    siteName: `${profile.initials}.DEV`,
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | ${profile.role}`,
    description: siteDescription,
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${monoFont.variable} ${displayFont.variable} ${heroFont.variable} dark antialiased`}
    >
      <body id="top">
        <CircuitField />
        <a className="skip-link" href="#main-content" tabIndex={0}>
          {copy.nav.skip}
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <CommandPalette />
        <TextLens />
      </body>
    </html>
  );
}
