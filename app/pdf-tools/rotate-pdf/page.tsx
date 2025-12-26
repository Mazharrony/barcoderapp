import type { Metadata } from "next";
import RotatePDF from '@/components/RotatePDF';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Rotate PDF Pages - Rotate PDF Online | Free PDF Rotator Tool",
  description: "Rotate PDF pages 90°, 180°, or 270° instantly. Free online PDF rotator tool - rotate specific pages or entire document. No registration required.",
  keywords: "rotate pdf, rotate pdf pages, pdf rotator, rotate pdf online, flip pdf pages, pdf page rotation, rotate pdf document",
  alternates: {
    canonical: `${siteUrl}/pdf-tools/rotate-pdf`,
  },
  openGraph: {
    title: "Rotate PDF Pages - Free PDF Rotator Tool",
    description: "Rotate PDF pages 90°, 180°, or 270° instantly. Free online PDF rotator - rotate specific pages or entire document.",
    url: `${siteUrl}/pdf-tools/rotate-pdf`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotate PDF Pages - Free PDF Rotator",
    description: "Rotate PDF pages instantly with customizable angles. Free, secure, and easy to use.",
  },
};

export default function RotatePDFPage() {
  return <RotatePDF />;
}



