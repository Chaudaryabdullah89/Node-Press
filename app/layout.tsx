import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/auth";
import AuthProvider from "./components/AuthProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Inkwell — A Magazine for the Curious Mind",
    template: "%s | Inkwell",
  },
  description:
    "Inkwell is a premium platform for writers and readers who believe in the power of thoughtful storytelling. Discover long-form essays, travel narratives, cultural critiques, and more.",
  keywords: [
    "blog",
    "articles",
    "travel",
    "technology",
    "lifestyle",
    "design",
    "culture",
  ],
  authors: [{ name: "Inkwell Team" }],
  creator: "Inkwell",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    siteName: "Inkwell",
    title: "Inkwell — A Magazine for the Curious Mind",
    description:
      "Premium long-form writing on travel, technology, food, design, and culture.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inkwell",
    description: "Premium long-form writing on the things that matter.",
    creator: "@inkwellmag",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-zinc-50">
        <AuthProvider session={session}>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
