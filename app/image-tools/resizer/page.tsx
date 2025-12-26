import type { Metadata } from "next";
import ImageResizer from '@/components/ImageResizer';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Image Resizer - Resize Images Online | Free Image Resizer Tool",
  description: "Resize images to any dimensions instantly. Free online image resizer - change image size with presets or custom dimensions. No registration required.",
  keywords: "image resizer, resize image, change image size, image size changer, resize photo, image dimensions, free image resizer",
  alternates: {
    canonical: `${siteUrl}/image-tools/resizer`,
  },
  openGraph: {
    title: "Image Resizer - Free Online Tool",
    description: "Resize images to any dimensions instantly. Free online image resizer with presets and custom dimensions.",
    url: `${siteUrl}/image-tools/resizer`,
    type: "website",
  },
};

export default function ImageResizerPage() {
  return <ImageResizer />;
}



