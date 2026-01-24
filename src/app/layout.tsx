import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Tom White | Premium Wholesale T-Shirts from Karol Bagh",
  description: "Premium quality wholesale T-shirts at competitive prices. Plain, Printed, Embroidered & more. Direct from manufacturer in Karol Bagh, New Delhi.",
  keywords: ["wholesale t-shirts", "bulk t-shirts", "karol bagh", "new delhi", "cotton t-shirts", "printed t-shirts"],
  openGraph: {
    title: "Tom White | Premium Wholesale T-Shirts",
    description: "Premium quality wholesale T-shirts at competitive prices. Direct from manufacturer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
