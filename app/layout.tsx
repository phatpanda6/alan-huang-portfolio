import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { palette } from "./theme";
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
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://alan-huang-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Alan Huang | Full-Stack Developer",
  description:
    "Step inside Alan’s Stack House. Explore Alan Huang’s work across interfaces, APIs and databases, from ContractLens to PHP and SQLite.",
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
      "Full-stack developer in Melbourne. Builder of ContractLens, an API change checker backed by 165 automated tests and CI.",
    siteName: "Alan Huang",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Alan Huang, full-stack developer. Software that holds up, with a ContractLens check flagging a breaking API change.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alan Huang | Full-Stack Developer",
    description:
      "Full-stack developer in Melbourne. Builder of ContractLens, an API change checker backed by 165 automated tests and CI.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: palette.paper,
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
