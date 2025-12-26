import type { Metadata } from "next";
import ImageToolPage from '@/components/ImageToolPage';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "PDF to Image Converter - Convert PDF Pages to Images | Free Tool",
  description: "Convert PDF pages to images instantly. Free online PDF to image converter - extract PDF pages as JPG, PNG images. No registration required.",
  keywords: "pdf to image, convert pdf to image, pdf to jpg, pdf to png, extract pdf pages, pdf image converter, free pdf to image",
  alternates: {
    canonical: `${siteUrl}/image-tools/pdf-to-image`,
  },
  openGraph: {
    title: "PDF to Image Converter - Free Online Tool",
    description: "Convert PDF pages to images instantly. Free online PDF to image converter.",
    url: `${siteUrl}/image-tools/pdf-to-image`,
    type: "website",
  },
};

export default function PDFToImagePage() {
  return (
    <ImageToolPage
      toolId="from-pdf"
      toolName="PDF to Image"
      toolDescription="Convert PDF pages to images"
      seoContent={{
        h1: "PDF to Image Converter - Free Online Tool",
        intro: "Convert PDF pages to images instantly with our free online PDF to image converter. Extract individual pages from PDF documents and save them as JPG or PNG images. Perfect for sharing, editing, or using PDF content as images.",
        features: [
          "Convert PDF pages to JPG or PNG",
          "Extract individual pages",
          "High-quality image output",
          "Batch page extraction",
          "Multiple format options"
        ],
        howItWorks: [
          "Upload your PDF file",
          "Select pages to convert (or convert all)",
          "Choose output format (JPG or PNG)",
          "Click 'Convert' to process",
          "Download your images"
        ],
        useCases: [
          "Extract pages from PDFs as images",
          "Convert PDF documents for editing",
          "Share PDF content as images",
          "Use PDF pages in presentations",
          "Archive PDF pages as images"
        ],
        faq: [
          {
            question: "What image formats can I convert PDF pages to?",
            answer: "You can convert PDF pages to JPG or PNG format. PNG is better for text and graphics, while JPG is better for photos."
          },
          {
            question: "Can I convert specific pages only?",
            answer: "Yes, you can select which pages to convert. You can convert all pages or choose specific page numbers."
          },
          {
            question: "Will the image quality match the PDF?",
            answer: "Yes, our converter maintains high quality. The images will preserve the resolution and quality of the original PDF pages."
          },
          {
            question: "Is PDF to image conversion safe?",
            answer: "Yes, all processing happens in your browser. Your PDFs are never uploaded to our servers, ensuring complete privacy and security."
          },
          {
            question: "What if my PDF has multiple pages?",
            answer: "Each page is converted to a separate image file. You can download all pages individually or as a ZIP file."
          }
        ]
      }}
    />
  );
}



