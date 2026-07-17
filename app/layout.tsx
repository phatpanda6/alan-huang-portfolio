import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Alan Huang | Full-Stack Developer",
  description:
    "Full-stack developer building reliable TypeScript products, including ContractLens—a tool for detecting breaking API response changes.",
  keywords: [
    "Alan Huang",
    "full-stack developer",
    "TypeScript",
    "React",
    "Next.js",
    "ContractLens",
  ],
  authors: [{ name: "Alan Huang" }],
  creator: "Alan Huang",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Alan Huang | Full-Stack Developer",
    description: "Building ContractLens to make breaking API changes visible.",
    siteName: "Alan Huang",
    images: [
      {
        url: "/og.png",
        width: 1792,
        height: 936,
        alt: "Alan Huang, full-stack developer building ContractLens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alan Huang | Full-Stack Developer",
    description: "Building ContractLens to make breaking API changes visible.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#080a0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable + " " + geistMono.variable}>
      <body>{children}</body>
    </html>
  );
}
