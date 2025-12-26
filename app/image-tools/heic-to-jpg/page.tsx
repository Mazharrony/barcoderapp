import type { Metadata } from "next";
import HEICConverter from '@/components/HEICConverter';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "HEIC to JPG Converter - Convert HEIC Images Online | Free Tool",
  description: "Convert HEIC images to JPG format instantly. Free online HEIC to JPG converter - convert iPhone photos to JPG. No registration required.",
  keywords: "heic to jpg, convert heic, heic converter, iphone photo converter, heic to jpeg, convert heic to jpg, free heic converter",
  alternates: {
    canonical: `${siteUrl}/image-tools/heic-to-jpg`,
  },
  openGraph: {
    title: "HEIC to JPG Converter - Free Online Tool",
    description: "Convert HEIC images to JPG format instantly. Free online HEIC to JPG converter for iPhone photos.",
    url: `${siteUrl}/image-tools/heic-to-jpg`,
    type: "website",
  },
};

export default function HEICToJPGPage() {
  return <HEICConverter />;
}



