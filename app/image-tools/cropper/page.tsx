import type { Metadata } from "next";
import ImageCropper from '@/components/ImageCropper';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Image Cropper - Crop Images Online | Free Image Cropping Tool",
  description: "Crop images online instantly. Free image cropper tool - select and crop image areas with precision. No registration required.",
  keywords: "image cropper, crop image, crop photo, image cropping tool, crop picture, free image cropper, online image cropper",
  alternates: {
    canonical: `${siteUrl}/image-tools/cropper`,
  },
  openGraph: {
    title: "Image Cropper - Free Online Tool",
    description: "Crop images online instantly. Free image cropper tool with precise selection.",
    url: `${siteUrl}/image-tools/cropper`,
    type: "website",
  },
};

export default function ImageCropperPage() {
  return <ImageCropper />;
}



