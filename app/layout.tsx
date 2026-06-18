import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Placeholder domain — update to the real Vercel URL once deployed.
  metadataBase: new URL("https://sherdor.vercel.app"),
  title: `${site.name} — ${site.title}`,
  description: site.about,
  openGraph: {
    title: `${site.name} — ${site.title}`,
    description: site.about,
    type: "website",
    locale: "en_US",
    siteName: `${site.name} — Portfolio`,
    url: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
