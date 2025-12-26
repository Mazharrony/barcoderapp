import type { Metadata } from "next";
import ImageToolPage from '@/components/ImageToolPage';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Background Remover - Remove Image Background Online | Free Tool",
  description: "Remove image backgrounds instantly. Free online background remover - remove backgrounds from photos automatically. No registration required.",
  keywords: "background remover, remove background, transparent background, remove bg, image background remover, free background remover, bg remover",
  alternates: {
    canonical: `${siteUrl}/image-tools/bg-remover`,
  },
  openGraph: {
    title: "Background Remover - Free Online Tool",
    description: "Remove image backgrounds instantly. Free online background remover with automatic detection.",
    url: `${siteUrl}/image-tools/bg-remover`,
    type: "website",
  },
};

export default function BGRemoverPage() {
  return (
    <ImageToolPage
      toolId="bg-remover"
      toolName="Background Remover"
      toolDescription="Remove backgrounds from images automatically"
      seoContent={{
        h1: "Background Remover - Free Online Tool",
        intro: "Remove image backgrounds instantly with our free online background remover. Automatically detect and remove backgrounds from photos, creating transparent PNG images. Perfect for product photos, portraits, and graphic design.",
        features: [
          "Automatic background detection",
          "Create transparent PNG images",
          "Precise edge detection",
          "Batch processing support",
          "High-quality output"
        ],
        howItWorks: [
          "Upload your image",
          "Background is automatically detected and removed",
          "Preview the result with transparent background",
          "Download your image with removed background"
        ],
        useCases: [
          "Remove backgrounds from product photos",
          "Create transparent images for design",
          "Remove backgrounds from portraits",
          "Prepare images for compositing",
          "Create professional cutouts"
        ],
        faq: [
          {
            question: "How accurate is the background removal?",
            answer: "Our tool uses advanced algorithms to automatically detect and remove backgrounds. Results vary depending on image complexity, but it works best with clear subjects and distinct backgrounds."
          },
          {
            question: "What format is the output?",
            answer: "The output is PNG format with transparency, allowing you to use the image with any background or in design software."
          },
          {
            question: "Can I remove backgrounds from complex images?",
            answer: "The tool works best with images that have clear subjects and distinct backgrounds. Complex images with similar colors may require manual touch-ups."
          },
          {
            question: "Is background removal safe?",
            answer: "Yes, all processing happens in your browser. Your images are never uploaded to our servers, ensuring complete privacy and security."
          },
          {
            question: "Can I process multiple images at once?",
            answer: "Yes, you can upload and process multiple images simultaneously. Each image is processed individually with automatic background removal."
          }
        ]
      }}
    />
  );
}



