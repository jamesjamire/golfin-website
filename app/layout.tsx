import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GOLFIN – Take Your Golf Game To The Next Level",
  description:
    "Experience the ultimate golfing journey with expert tips, pro strategies, and professional insights. Join 12k+ members at GOLFIN.",
  keywords: "golf, golfing, golf tips, golf community, golf events, golf training",
  openGraph: {
    title: "GOLFIN – Take Your Golf Game To The Next Level",
    description:
      "Experience the ultimate golfing journey with expert tips, pro strategies, and professional insights.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
