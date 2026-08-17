import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { site, experiences, education } from "@/lib/content";
import ThemeProvider from "@/components/ThemeProvider";
import LiquidBg from "@/components/LiquidBg";
import MusicPlayer from "@/components/MusicPlayer";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

// Structured data so search engines link the profile to its LinkedIn/GitHub
// accounts and current employer.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: experiences[0].role,
  email: `mailto:${site.email}`,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tashkent",
    addressCountry: "UZ",
  },
  worksFor: {
    "@type": "Organization",
    name: experiences[0].company,
    url: experiences[0].companyUrl,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education.school,
  },
  sameAs: [site.linkedin, site.github],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-surface text-primary antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <LiquidBg />
        <ThemeProvider>
          <div className="relative">{children}</div>
          <MusicPlayer />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
