import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Toast from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Promise.Bond - Campus Connections Made Simple",
  description:
    "Join your campus community and discover meaningful connections. The modern way to find your perfect match in college.",
  keywords: [
    "campus",
    "dating",
    "university",
    "college",
    "connections",
    "students",
  ],
  authors: [{ name: "Promise.Bond Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ff6b9d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="bond">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100`}
      >
        {children}
        <Toast />
      </body>
    </html>
  );
}
