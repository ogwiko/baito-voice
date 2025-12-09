import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/Sidebar";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Baito-Voice - バイトの声を社会的に変換",
    template: "%s | Baito-Voice",
  },
  description: "バイトの口コミをAIが社会的に適切な表現に変換して投稿・閲覧できるプラットフォーム",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://baito-voice.vercel.app"),
  openGraph: {
    title: "Baito-Voice - バイトの声を社会的に変換",
    description: "バイトの口コミをAIが社会的に適切な表現に変換して投稿・閲覧できるプラットフォーム",
    url: "/",
    siteName: "Baito-Voice",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baito-Voice - バイトの声を社会的に変換",
    description: "バイトの口コミをAIが社会的に適切な表現に変換して投稿・閲覧できるプラットフォーム",
  },
  verification: {
    google: "Istt3O6xPprsjRoI1Ae8UIhYMntWIQggXl_QPqsCUfA",
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
