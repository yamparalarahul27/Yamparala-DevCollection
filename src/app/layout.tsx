import type { Metadata } from "next";
import { Belanosima, Inter, Roboto, VT323 } from "next/font/google";
import { AgentationDevtools } from "@/components/AgentationDevtools";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

const belanosima = Belanosima({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: "400",
});

const pixel = VT323({
  subsets: ["latin"],
  variable: "--font-pixel",
  weight: "400",
});

const siteTitle = "Yamparala Component Collection";
const siteDescription =
  "A curated collection of polished, copy-ready React components, interaction patterns, buttons, charts, and visual UI experiments.";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3001";
const metadataBase = new URL(
  siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`,
);
const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Yamparala Component Collection with the Proteus bucket logo",
};

export const metadata: Metadata = {
  metadataBase,
  applicationName: siteTitle,
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: "/",
    siteName: siteTitle,
    images: [ogImage],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/bucket-logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} ${belanosima.variable} ${pixel.variable} antialiased`}
      >
        {children}
        <AgentationDevtools />
      </body>
    </html>
  );
}
