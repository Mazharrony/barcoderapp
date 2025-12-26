import type { Metadata } from "next";
import CompressPDF from '@/components/CompressPDF';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Compress PDF Online - Reduce PDF File Size | Free PDF Compressor",
  description: "Compress PDF files to reduce file size without losing quality. Free online PDF compressor tool - shrink PDF size for email, sharing, or storage. No registration required.",
  keywords: "compress pdf, reduce pdf size, pdf compressor, shrink pdf, pdf file size reducer, compress pdf online, free pdf compressor, pdf size optimizer",
  alternates: {
    canonical: `${siteUrl}/pdf-tools/compress-pdf`,
  },
  openGraph: {
    title: "Compress PDF Online - Free PDF Compressor",
    description: "Reduce PDF file size without losing quality. Free online PDF compressor - shrink PDFs for email and sharing.",
    url: `${siteUrl}/pdf-tools/compress-pdf`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress PDF Online - Free PDF Compressor",
    description: "Reduce PDF file size instantly. Free, secure, and easy to use.",
  },
};

export default function CompressPDFPage() {
  return <CompressPDF />;
}



