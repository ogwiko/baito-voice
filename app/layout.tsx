import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://baito-voice-rdps.vercel.app';

export const metadata: Metadata = {
  title: {
    default: "Baito Voice - バイトの本音をAIが社会的に変換",
    template: "%s | Baito Voice",
  },
  description: "「店長マジ無理」→AIがビジネス文書に変換。バイト口コミの新しい形。本音で書いてAIが整える、バイトレビュープラットフォーム。",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Baito Voice - バイトの本音をAIが社会的に変換",
    description: "「店長マジ無理」→AIがビジネス文書に変換。バイト口コミの新しい形。本音で書いてAIが整える、バイトレビュープラットフォーム。",
    url: siteUrl,
    siteName: "Baito Voice",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baito Voice - バイトの本音をAIが社会的に変換",
    description: "「店長マジ無理」→AIがビジネス文書に変換。バイト口コミの新しい形。本音で書いてAIが整える、バイトレビュープラットフォーム。",
    site: "@baito_voice",
  },
  keywords: ["バイト", "口コミ", "アルバイト", "レビュー", "AI", "時給", "評判"],
  verification: {
    google: "Istt3O6xPprsjRoI1Ae8UIhYMntWIQggXl_QPqsCUfA",
    other: {
      "google-adsense-account": "ca-pub-8822788518845939",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8822788518845939"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 md:ml-64 p-4 md:p-8 transition-all duration-300">
            <div className="max-w-5xl mx-auto mt-12 md:mt-0">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
