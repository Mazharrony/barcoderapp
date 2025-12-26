import type { Metadata } from "next";
import MergePDF from '@/components/MergePDF';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Merge PDF Files Online - Free PDF Merger Tool | Combine Multiple PDFs",
  description: "Merge multiple PDF files into one document instantly. Free online PDF merger tool - combine, join, and merge PDFs without quality loss. No registration required.",
  keywords: "merge pdf, combine pdf, join pdf, pdf merger, merge pdf files, combine multiple pdfs, pdf combiner, merge pdf online, free pdf merger",
  alternates: {
    canonical: `${siteUrl}/pdf-tools/merge-pdf`,
  },
  openGraph: {
    title: "Merge PDF Files Online - Free PDF Merger Tool",
    description: "Merge multiple PDF files into one document instantly. Free online PDF merger - combine PDFs without quality loss.",
    url: `${siteUrl}/pdf-tools/merge-pdf`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Files Online - Free PDF Merger",
    description: "Combine multiple PDF files into one document instantly. Free, secure, and easy to use.",
  },
};

export default function MergePDFPage() {
  return <MergePDF />;
}



