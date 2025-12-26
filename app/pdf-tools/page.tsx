import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "PDF Tools - Free Online PDF Utilities | Merge, Split, Compress & More",
  description: "Free online PDF tools: Merge, split, compress, lock, unlock, add page numbers, and rotate PDF pages. All tools work in your browser - no uploads, completely secure.",
  keywords: "pdf tools, merge pdf, split pdf, compress pdf, lock pdf, unlock pdf, pdf utilities, free pdf tools, online pdf tools",
  alternates: {
    canonical: `${siteUrl}/pdf-tools`,
  },
  openGraph: {
    title: "PDF Tools - Free Online PDF Utilities",
    description: "Free online PDF tools: Merge, split, compress, lock, unlock, and more. All tools work in your browser.",
    url: `${siteUrl}/pdf-tools`,
  },
};

const tools = [
  {
    name: "Merge PDF",
    description: "Combine multiple PDF files into one document",
    href: "/pdf-tools/merge-pdf",
    icon: "📄",
    features: ["Combine unlimited PDFs", "Maintain quality", "Fast processing"]
  },
  {
    name: "Split PDF",
    description: "Extract specific pages from PDF documents",
    href: "/pdf-tools/split-pdf",
    icon: "✂️",
    features: ["Extract pages or ranges", "Multiple pages at once", "Preserve quality"]
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size without losing quality",
    href: "/pdf-tools/compress-pdf",
    icon: "📦",
    features: ["Reduce file size", "Adjustable compression", "Fast processing"]
  },
  {
    name: "Lock PDF",
    description: "Add password protection to secure PDF files",
    href: "/pdf-tools/lock-pdf",
    icon: "🔒",
    features: ["Owner & user passwords", "Strong encryption", "Secure documents"]
  },
  {
    name: "Unlock PDF",
    description: "Remove password protection from PDF files",
    href: "/pdf-tools/unlock-pdf",
    icon: "🔓",
    features: ["Remove passwords", "Maintain quality", "Fast unlocking"]
  },
  {
    name: "Add Page Numbers",
    description: "Add page numbers to PDF documents",
    href: "/pdf-tools/add-page-numbers",
    icon: "🔢",
    features: ["Customizable position", "Adjustable font size", "Professional formatting"]
  },
  {
    name: "Rotate PDF",
    description: "Rotate PDF pages 90°, 180°, or 270°",
    href: "/pdf-tools/rotate-pdf",
    icon: "🔄",
    features: ["Multiple angles", "Specific pages or all", "Fix orientation"]
  },
];

export default function PDFToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-16 text-center animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Complete PDF Toolkit
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
              Free PDF Tools<br />for Everyone
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
              Complete suite of PDF utilities - merge, split, compress, lock, unlock, add page numbers, and rotate. All tools work in your browser, completely free, no registration required.
            </p>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">All PDF Tools</h2>
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Why Use Our PDF Tools?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">100% Secure & Private</h3>
              <p className="text-gray-700 dark:text-gray-300">
                All PDF processing happens in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security for your sensitive documents.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Completely Free</h3>
              <p className="text-gray-700 dark:text-gray-300">
                All our PDF tools are completely free to use. No hidden fees, no watermarks, no file size limits, and no registration required.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Works Everywhere</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Access our PDF tools from any device - desktop, tablet, or mobile. Works in all modern browsers without any software installation.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Fast & Reliable</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Process your PDFs instantly with our optimized tools. No waiting, no delays - get your results in seconds.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Are my PDF files safe?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Yes, absolutely! All processing happens in your browser. Your files never leave your device and are never uploaded to any server.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Do I need to create an account?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                No, all our PDF tools are completely free to use without any registration or account creation required.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Are there any file size limits?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                No, there are no file size limits. However, very large files may take longer to process depending on your device&apos;s capabilities.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Will the quality of my PDFs be affected?</h3>
              <p className="text-gray-700 dark:text-gray-300">
                No, our tools preserve the original quality of your PDFs. Text, images, and formatting remain exactly as they were.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
