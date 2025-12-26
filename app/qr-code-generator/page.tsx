import type { Metadata } from "next";
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "QR Code Generator - Create QR Codes Online | Free QR Code Maker",
  description: "Generate QR codes online for free. Create custom QR codes with logos, colors, and styles. Download in PNG, JPEG, SVG, or PDF. No registration required.",
  keywords: "qr code generator, create qr code, qr code maker, qr code creator, free qr code generator, qr code with logo, custom qr code, online qr code generator",
  alternates: {
    canonical: `${siteUrl}/qr-code-generator`,
  },
  openGraph: {
    title: "QR Code Generator - Free Online QR Code Maker",
    description: "Generate QR codes online for free. Create custom QR codes with logos and colors instantly.",
    url: `${siteUrl}/qr-code-generator`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator - Free Online Tool",
    description: "Generate QR codes online for free. Create custom QR codes instantly.",
  },
};

export default function QRCodeGeneratorPage() {
  return <QRCodeGenerator />;
}
