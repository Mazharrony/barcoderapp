import type { Metadata } from "next";
import SplitPDF from '@/components/SplitPDF';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Split PDF Online - Extract Pages from PDF | Free PDF Splitter Tool",
  description: "Split PDF files and extract specific pages instantly. Free online PDF splitter tool - extract, separate, and split PDF pages. No registration required.",
  keywords: "split pdf, extract pdf pages, pdf splitter, separate pdf, extract pages from pdf, split pdf online, pdf page extractor, free pdf splitter",
  alternates: {
    canonical: `${siteUrl}/pdf-tools/split-pdf`,
  },
  openGraph: {
    title: "Split PDF Online - Free PDF Splitter Tool",
    description: "Split PDF files and extract specific pages instantly. Free online PDF splitter - extract pages without quality loss.",
    url: `${siteUrl}/pdf-tools/split-pdf`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split PDF Online - Free PDF Splitter",
    description: "Extract specific pages from PDF files instantly. Free, secure, and easy to use.",
  },
};

export default function SplitPDFPage() {
  return <SplitPDF />;
}



