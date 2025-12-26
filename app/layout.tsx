import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteUrl, seoConfig } from "@/lib/seo-config";
import { siteConfig } from "@/lib/config";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seoConfig.title,
    template: "%s | xotools",
  },
  description: seoConfig.description,
  keywords: seoConfig.keywords,
  authors: [{ name: seoConfig.author }],
  creator: seoConfig.author,
  publisher: seoConfig.author,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: seoConfig.locale,
    url: siteUrl,
    siteName: seoConfig.siteName,
    title: seoConfig.title,
    description: seoConfig.description,
    images: [
      {
        url: `${siteUrl}${seoConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: "Barcode Generator - Free Online Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.title,
    description: seoConfig.description,
    images: [`${siteUrl}${seoConfig.ogImage}`],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/barcoderapp-logo.svg",
    apple: "/barcoderapp-logo.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data - Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.siteName,
    url: siteUrl,
    logo: `${siteUrl}/barcoderapp-logo.svg`,
    description: seoConfig.description,
    sameAs: [
      siteConfig.behanceLink,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["English"],
    },
  };

  // Structured Data - WebApplication Schema
  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: seoConfig.siteName,
    url: siteUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: seoConfig.description,
    featureList: [
      "Multiple barcode types (Code128, EAN, UPC, QR Code)",
      "Batch generation",
      "Multiple export formats (PNG, JPEG, SVG, PDF)",
      "Customizable design",
      "No registration required",
      "Real-time preview",
      "Dark mode support",
    ],
    softwareVersion: "1.0.0",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="jfXflqNJgfRxhwhfFyIaE3Z2if2wRm96pbviC3O635Y" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema),
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ErrorBoundary>
          <Header />
          {children}
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
