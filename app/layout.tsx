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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://alan-huang-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Alan Huang | Full-Stack Developer",
  description:
    "Australia-based full-stack developer building reliable TypeScript products with React, Next.js, APIs and PostgreSQL. Currently building ContractLens.",
  keywords: [
    "Alan Huang",
    "full-stack developer",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "ContractLens",
    "Melbourne",
    "Sydney",
  ],
  authors: [{ name: "Alan Huang" }],
  creator: "Alan Huang",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Alan Huang | Full-Stack Developer",
    description:
      "Full-stack developer building ContractLens to detect breaking API changes before they reach users.",
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
    description:
      "Full-stack developer building ContractLens to detect breaking API changes before they reach users.",
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
