import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script"; // Strict dynamic performance loading optimization
import "./globals.css";
import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/footer/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stackforge.ai"),
  title: {
    default: "StackForge AI - SaaS Tool Reviews, Comparisons & Affiliate Programs",
    template: "%s | StackForge AI",
  },
  description:
    "Premium editorial reviews, comparisons, rankings, and deals for funnel builders, CRM, automation, and online business software.",
  keywords: [
    "SaaS reviews",
    "funnel builder",
    "marketing automation",
    "CRM",
    "affiliate programs",
    "Systeme.io",
    "ClickFunnels",
    "HighLevel",
  ],
  authors: [{ name: "StackForge AI Team" }],
  creator: "StackForge AI",
  publisher: "StackForge AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stackforge.ai",
    siteName: "StackForge AI",
    title: "StackForge AI - SaaS Tool Reviews & Comparisons",
    description:
      "Premium editorial reviews, comparisons, rankings, and deals for online business software.",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackForge AI - SaaS Tool Reviews & Comparisons",
    description:
      "Premium editorial reviews, comparisons, rankings, and deals for online business software.",
    creator: "@stackforgeai",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "verify-admitad": "f4631ae44e",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&amp;display=swap" />
      </head>
      <body className="min-h-screen bg-zinc-50 text-zinc-800 selection:bg-zinc-200 m-0 p-0">
        <div className="relative flex min-h-screen flex-col bg-zinc-50 w-full overflow-x-hidden">
          <Header />

          {/* Fixed bounds removed globally so header components stretch full screen width edge-to-edge */}
          <main className="w-full flex-1 m-0 p-0 block">
            {children}
          </main>

          <Footer />
        </div>

        {/* Skimlinks Live Automated Monetization Integration Pipeline */}
        <Script 
          id="skimlinks-monetization-engine"
          src="https://s.skimresources.com/js/304911X1793102.skimlinks.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
