import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Image Tools - Free Online Image Utilities | Compress, Convert, Resize & More",
  description: "Free online image tools: Compress, convert (JPG/PNG/WEBP), resize, crop, remove background, convert to PDF, and more. All tools work in your browser - no uploads, completely secure.",
  keywords: "image tools, image compressor, image converter, image resizer, image cropper, image to pdf, pdf to image, heic converter, background remover",
  alternates: {
    canonical: `${siteUrl}/image-tools`,
  },
  openGraph: {
    title: "Image Tools - Free Online Image Utilities",
    description: "Free online image tools: Compress, convert, resize, crop, and more. All tools work in your browser.",
    url: `${siteUrl}/image-tools`,
  },
};

const tools = [
  {
    name: "Image Compressor",
    description: "Reduce image file size without losing quality",
    href: "/image-tools/compressor",
    icon: "📦",
    features: ["Reduce file size", "Maintain quality", "Batch processing"]
  },
  {
    name: "Image Converter",
    description: "Convert between JPG, PNG, and WEBP formats",
    href: "/image-tools/converter",
    icon: "🔄",
    features: ["Multiple formats", "Quality control", "Batch conversion"]
  },
  {
    name: "Image Resizer",
    description: "Resize images to any dimensions",
    href: "/image-tools/resizer",
    icon: "📏",
    features: ["Custom dimensions", "Social media presets", "Aspect ratio control"]
  },
  {
    name: "Image Cropper",
    description: "Crop images with precision",
    href: "/image-tools/cropper",
    icon: "✂️",
    features: ["Precise selection", "Real-time preview", "Custom dimensions"]
  },
  {
    name: "Image to PDF",
    description: "Convert images to PDF documents",
    href: "/image-tools/image-to-pdf",
    icon: "📄",
    features: ["Multiple formats", "Multi-page PDFs", "High quality"]
  },
  {
    name: "PDF to Image",
    description: "Convert PDF pages to images",
    href: "/image-tools/pdf-to-image",
    icon: "🖼️",
    features: ["Page extraction", "JPG/PNG output", "Batch processing"]
  },
  {
    name: "HEIC to JPG",
    description: "Convert HEIC images to JPG format",
    href: "/image-tools/heic-to-jpg",
    icon: "📱",
    features: ["iPhone photos", "Batch conversion", "High quality"]
  },
  {
    name: "Background Remover",
    description: "Remove backgrounds from images automatically",
    href: "/image-tools/bg-remover",
    icon: "🎨",
    features: ["Automatic detection", "Transparent PNG", "Precise edges"]
  },
];

export default function ImageToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-16 text-center animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Complete Image Toolkit
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
              Free Image Tools<br />for Everyone
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
              Complete suite of image utilities - compress, convert, resize, crop, remove backgrounds, convert to PDF, and more. All tools work in your browser, completely free, no registration required.
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">All Image Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/60 dark:border-gray-700/60 p-6 hover:shadow-2xl hover:scale-105 transition-all"
              >
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{tool.description}</p>
                <ul className="space-y-1 mb-4">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-blue-600 dark:text-blue-400 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Use Tool
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="mb-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Why Use Our Image Tools?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">100% Secure & Private</h3>
              <p className="text-gray-700 dark:text-gray-300">
                All image processing happens in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security for your images.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Completely Free</h3>
              <p className="text-gray-700 dark:text-gray-300">
                All our image tools are completely free to use. No hidden fees, no watermarks, no file size limits, and no registration required.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Works Everywhere</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Access our image tools from any device - desktop, tablet, or mobile. Works in all modern browsers without any software installation.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Fast & Reliable</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Process your images instantly with our optimized tools. No waiting, no delays - get your results in seconds.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
