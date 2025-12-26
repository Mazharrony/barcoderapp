import type { Metadata } from "next";
import AddPageNumbersPDF from '@/components/AddPageNumbersPDF';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF - Number PDF Pages Online | Free Tool",
  description: "Add page numbers to PDF documents instantly. Free online tool to number PDF pages with customizable position, font size, and starting number. No registration required.",
  keywords: "add page numbers to pdf, number pdf pages, pdf page numbering, insert page numbers pdf, pdf page numbers, number pages in pdf",
  alternates: {
    canonical: `${siteUrl}/pdf-tools/add-page-numbers`,
  },
  openGraph: {
    title: "Add Page Numbers to PDF - Free Online Tool",
    description: "Add page numbers to PDF documents with customizable position and style. Free online PDF page numbering tool.",
    url: `${siteUrl}/pdf-tools/add-page-numbers`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Add Page Numbers to PDF - Free Tool",
    description: "Number PDF pages instantly with customizable options. Free, secure, and easy to use.",
  },
};

export default function AddPageNumbersPage() {
  return <AddPageNumbersPDF />;
}



