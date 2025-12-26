import type { Metadata } from "next";
import BarcodeGenerator from '@/components/BarcodeGenerator';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Barcode Generator - Create Barcodes Online | Free Barcode Maker",
  description: "Generate barcodes online for free. Create Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, MSI, Pharmacode, and Codabar barcodes instantly. Customizable design, multiple export formats. No registration required.",
  keywords: "barcode generator, create barcode, barcode maker, code 128, code 39, ean-13, upc-a, barcode creator, free barcode generator, online barcode generator",
  alternates: {
    canonical: `${siteUrl}/barcode-generator`,
  },
  openGraph: {
    title: "Barcode Generator - Free Online Barcode Maker",
    description: "Generate barcodes online for free. Create Code 128, Code 39, EAN-13, UPC-A and more barcodes instantly.",
    url: `${siteUrl}/barcode-generator`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Barcode Generator - Free Online Tool",
    description: "Generate barcodes online for free. Create multiple barcode types instantly.",
  },
};

export default function BarcodeGeneratorPage() {
  return <BarcodeGenerator />;
}



