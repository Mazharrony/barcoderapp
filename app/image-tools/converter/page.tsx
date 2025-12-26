import type { Metadata } from "next";
import ImageConverter from '@/components/ImageConverter';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Image Converter - Convert JPG, PNG, WEBP Online | Free Image Format Converter",
  description: "Convert images between JPG, PNG, and WEBP formats instantly. Free online image converter - change image format without quality loss. No registration required.",
  keywords: "image converter, convert image, jpg to png, png to jpg, webp converter, image format converter, convert image format, free image converter",
  alternates: {
    canonical: `${siteUrl}/image-tools/converter`,
  },
  openGraph: {
    title: "Image Converter - Free Online Tool",
    description: "Convert images between JPG, PNG, and WEBP formats instantly. Free online image converter.",
    url: `${siteUrl}/image-tools/converter`,
    type: "website",
  },
};

export default function ImageConverterPage() {
  return <ImageConverter />;
}



