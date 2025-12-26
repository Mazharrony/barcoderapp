import type { Metadata } from "next";
import LockPDF from '@/components/LockPDF';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Lock PDF with Password - Protect PDF Files | Free PDF Password Protection",
  description: "Add password protection to PDF files to secure sensitive documents. Free online PDF lock tool - encrypt and protect PDFs with passwords. No registration required.",
  keywords: "lock pdf, password protect pdf, encrypt pdf, secure pdf, pdf password protection, protect pdf file, pdf encryption, lock pdf online",
  alternates: {
    canonical: `${siteUrl}/pdf-tools/lock-pdf`,
  },
  openGraph: {
    title: "Lock PDF with Password - Free PDF Protection Tool",
    description: "Add password protection to PDF files to secure sensitive documents. Free online PDF encryption tool.",
    url: `${siteUrl}/pdf-tools/lock-pdf`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lock PDF with Password - Free PDF Protection",
    description: "Secure your PDF files with password protection. Free, secure, and easy to use.",
  },
};

export default function LockPDFPage() {
  return <LockPDF />;
}



