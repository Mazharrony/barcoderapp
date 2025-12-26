import type { Metadata } from "next";
import ImageToPDF from '@/components/ImageToPDF';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Image to PDF Converter - Convert Images to PDF Online | Free Tool",
  description: "Convert images to PDF documents instantly. Free online image to PDF converter - convert JPG, PNG, WEBP to PDF. No registration required.",
  keywords: "image to pdf, convert image to pdf, jpg to pdf, png to pdf, image pdf converter, photos to pdf, free image to pdf",
  alternates: {
    canonical: `${siteUrl}/image-tools/image-to-pdf`,
  },
  openGraph: {
    title: "Image to PDF Converter - Free Online Tool",
    description: "Convert images to PDF documents instantly. Free online image to PDF converter.",
    url: `${siteUrl}/image-tools/image-to-pdf`,
    type: "website",
  },
};

export default function ImageToPDFPage() {
  return <ImageToPDF />;
}



