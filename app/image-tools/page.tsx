import type { Metadata } from "next";
import ImageTools from '@/components/ImageTools';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Image Tools - Compressor, Converter, Resizer & More | Free Online Tools",
  description: "Free online image tools: Compress, convert (JPG/PNG/WEBP), resize, crop, remove background, convert to PDF, and more. All tools in one place!",
  alternates: {
    canonical: `${siteUrl}/image-tools`,
  },
  openGraph: {
    title: "Image Tools - Compressor, Converter, Resizer & More",
    description: "Free online image tools: Compress, convert, resize, crop, and more.",
    url: `${siteUrl}/image-tools`,
  },
};

export default function ImageToolsPage() {
  return <ImageTools />;
}

