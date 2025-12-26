'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';
import {
  compressImage,
  convertImageFormat,
  resizeImage,
  cropImage,
  imageToPDF,
  socialMediaPresets,
} from '@/lib/image-utils';

type ToolType = 'compressor' | 'converter' | 'resizer' | 'cropper' | 'to-pdf' | 'from-pdf' | 'heic' | 'bg-remover';

interface ProcessedFile {
  id: string;
  originalName: string;
  file: File;
  processedBlob?: Blob;
  processedDataUrl?: string;
  originalSize?: number;
  processedSize?: number;
  error?: string;
  cropData?: { x: number; y: number; width: number; height: number };
}

interface SEOContent {
  h1: string;
  intro: string;
  features: string[];
  howItWorks: string[];
  useCases: string[];
  faq: { question: string; answer: string }[];
}

interface ImageToolPageProps {
  toolId: ToolType;
  toolName: string;
  toolDescription: string;
  seoContent: SEOContent;
}

export default function ImageToolPage({ toolId, toolName, toolDescription, seoContent }: ImageToolPageProps) {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Compressor settings
  const [compressionQuality, setCompressionQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState<number | undefined>();
  const [maxHeight, setMaxHeight] = useState<number | undefined>();
  
  // Converter settings
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [converterQuality, setConverterQuality] = useState(90);
  const [converterBgColor, setConverterBgColor] = useState('#FFFFFF');
  
  // Resizer settings
  const [resizeWidth, setResizeWidth] = useState<number | undefined>();
  const [resizeHeight, setResizeHeight] = useState<number | undefined>();
  const [resizePercent, setResizePercent] = useState<number | undefined>();
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  
  // Cropper settings
  const [cropImageData, setCropImageData] = useState<{ url: string; width: number; height: number } | null>(null);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  
  // PDF settings
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, accept: string = 'image/*') => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: ProcessedFile[] = selectedFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      originalName: file.name,
      file,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Tool-specific handlers (simplified - full implementation would include all handlers from ImageTools)
  const handleProcess = async () => {
    // This would call the appropriate handler based on toolId
    // For now, this is a placeholder structure
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
    setCropImageData(null);
    setCropStart(null);
    setCropEnd(null);
    setIsCropping(false);
  };

  // Render tool-specific controls based on toolId
  const renderToolControls = () => {
    // This would render different controls based on toolId
    // Similar to how PDFToolPage works
    return (
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Select Image File(s)
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer text-center text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Choose Files
        </label>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            {seoContent.h1}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            {seoContent.intro}
          </p>
        </section>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Tool Panel */}
          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              {toolName}
            </h2>
            {renderToolControls()}
            {files.length > 0 && (
              <button
                onClick={clearAll}
                className="w-full mt-4 py-2 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* SEO Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Features */}
            <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
              <ul className="space-y-3">
                {seoContent.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* How It Works */}
            <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
              <ol className="space-y-4">
                {seoContent.howItWorks.map((step, index) => (
                  <li key={index} className="flex gap-4 text-gray-700 dark:text-gray-300">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Use Cases */}
            <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Common Use Cases</h2>
              <ul className="space-y-3">
                {seoContent.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FAQ */}
            <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {seoContent.faq.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.question}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Tools */}
            <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Other Image Tools</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Image Compressor', href: '/image-tools/compressor' },
                  { name: 'Image Converter', href: '/image-tools/converter' },
                  { name: 'Image Resizer', href: '/image-tools/resizer' },
                  { name: 'Image Cropper', href: '/image-tools/cropper' },
                  { name: 'Image to PDF', href: '/image-tools/image-to-pdf' },
                  { name: 'PDF to Image', href: '/image-tools/pdf-to-image' },
                  { name: 'HEIC to JPG', href: '/image-tools/heic-to-jpg' },
                  { name: 'BG Remover', href: '/image-tools/bg-remover' },
                ].filter(tool => tool.href !== `/image-tools/${toolId === 'compressor' ? 'compressor' : toolId === 'converter' ? 'converter' : toolId === 'resizer' ? 'resizer' : toolId === 'cropper' ? 'cropper' : toolId === 'to-pdf' ? 'image-to-pdf' : toolId === 'from-pdf' ? 'pdf-to-image' : toolId === 'heic' ? 'heic-to-jpg' : 'bg-remover'}`).map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium text-center"
                  >
                    {tool.name}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}



