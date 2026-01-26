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
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: "Tom White | Premium Wholesale T-Shirts",
    description: "Premium quality wholesale T-shirts at competitive prices. Direct from manufacturer.",
    type: "website",
    images: ['/logo-dark.png'],
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
