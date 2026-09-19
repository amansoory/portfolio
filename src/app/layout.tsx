import { copy } from "@/lib/copy";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ReadingRail } from "@/components/reading-rail";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/portfolio-ui";
import { profile, siteDescription, siteUrl } from "@/lib/portfolio";

const displayFont = Space_Grotesk({ variable: "--font-display", subsets: ["latin"], display: "swap" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} dark antialiased`}
    >
      <body id="top">
        <a className="skip-link" href="#main-content">
          {copy.nav.skip}
        </a>
        <SiteHeader />
        <ReadingRail />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
