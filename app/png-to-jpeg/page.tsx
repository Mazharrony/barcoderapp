import type { Metadata } from "next";
import ImageConverter from '@/components/ImageConverter';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "PNG to JPEG Converter - Bulk Image Format Converter",
  description: "Convert PNG images to JPEG format in bulk. Free online tool to convert multiple PNG files to JPEG instantly. No registration required!",
  alternates: {
    canonical: `${siteUrl}/png-to-jpeg`,
  },
  openGraph: {
    title: "PNG to JPEG Converter - Bulk Image Format Converter",
    description: "Convert PNG images to JPEG format in bulk. Free online tool.",
    url: `${siteUrl}/png-to-jpeg`,
  },
};

export default function PNGToJPEG() {
  return <ImageConverter />;
}



