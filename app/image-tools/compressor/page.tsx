import type { Metadata } from "next";
import ImageCompressor from '@/components/ImageCompressor';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Image Compressor - Reduce Image File Size Online | Free Image Compressor",
  description: "Compress images to reduce file size without losing quality. Free online image compressor - shrink JPG, PNG, WEBP files instantly. No registration required.",
  keywords: "image compressor, compress image, reduce image size, image size reducer, compress jpg, compress png, image optimizer, free image compressor",
  alternates: {
    canonical: `${siteUrl}/image-tools/compressor`,
  },
  openGraph: {
    title: "Image Compressor - Free Online Tool",
    description: "Compress images to reduce file size without losing quality. Free online image compressor.",
    url: `${siteUrl}/image-tools/compressor`,
    type: "website",
  },
};

export default function ImageCompressorPage() {
  return <ImageCompressor />;
}



