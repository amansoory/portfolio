import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/portfolio-ui";
import { profile, siteDescription, siteUrl } from "@/lib/portfolio";

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
    default: `${profile.name} — Software Engineer`,
    template: `%s | ${profile.name}`,
  },
  description: siteDescription,
  robots: { index: !profile.draft, follow: !profile.draft },
  openGraph: {
    title: `${profile.name} — Software Engineer`,
    description: siteDescription,
    type: "website",
    locale: "en_US",
    siteName: "SE.DEV",
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Software Engineer`,
    description: siteDescription,
  },
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
    >
      <body id="top">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
