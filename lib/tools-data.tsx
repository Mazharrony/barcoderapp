'use client';

// Tools data structure for xotools.io
import { routes } from './routes';

export interface Tool {
  id: string;
  title: string;
  description: string;
  href: string;
  category: 'image' | 'pdf' | 'text' | 'generator' | 'developer' | 'calculator';
  icon: string; // SVG path or icon name
}

export const tools: Tool[] = [
  // Generators
  {
    id: 'qr-code-generator',
    title: 'QR Code Generator',
    description: 'Create custom QR codes instantly',
    href: routes.standalone.qrGenerator,
    category: 'generator',
    icon: 'qr',
  },
  {
    id: 'barcode-generator',
    title: 'Barcode Generator',
    description: 'Generate barcodes in multiple formats',
    href: routes.standalone.barcodeGenerator,
    category: 'generator',
    icon: 'barcode',
  },
  
  // Image Tools - Detail Pages
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Reduce image file size without losing quality',
    href: routes.imageTools.compressor,
    category: 'image',
    icon: 'compress',
  },
  {
    id: 'image-converter',
    title: 'Image Converter',
    description: 'Convert between PNG, JPEG, WEBP formats',
    href: routes.imageTools.converter,
    category: 'image',
    icon: 'image',
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images to any dimensions',
    href: routes.imageTools.resizer,
    category: 'image',
    icon: 'resize',
  },
  {
    id: 'image-cropper',
    title: 'Image Cropper',
    description: 'Crop images with precision',
    href: routes.imageTools.cropper,
    category: 'image',
    icon: 'resize',
  },
  {
    id: 'png-to-jpeg',
    title: 'PNG to JPEG',
    description: 'Convert PNG images to JPEG format',
    href: routes.standalone.pngToJpeg,
    category: 'image',
    icon: 'convert',
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF',
    description: 'Convert images to PDF documents',
    href: routes.imageTools.imageToPdf,
    category: 'image',
    icon: 'imagePdf',
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to Image',
    description: 'Convert PDF pages to images',
    href: routes.imageTools.pdfToImage,
    category: 'image',
    icon: 'image',
  },
  {
    id: 'heic-to-jpg',
    title: 'HEIC to JPG',
    description: 'Convert HEIC images to JPG format',
    href: routes.imageTools.heicToJpg,
    category: 'image',
    icon: 'convert',
  },
  {
    id: 'bg-remover',
    title: 'Background Remover',
    description: 'Remove backgrounds from images automatically',
    href: routes.imageTools.bgRemover,
    category: 'image',
    icon: 'image',
  },
  
  // PDF Tools - Detail Pages
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document',
    href: routes.pdfTools.merge,
    category: 'pdf',
    icon: 'pdf',
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    description: 'Extract specific pages from PDF documents',
    href: routes.pdfTools.split,
    category: 'pdf',
    icon: 'pdf',
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce PDF file size without losing quality',
    href: routes.pdfTools.compress,
    category: 'pdf',
    icon: 'pdf',
  },
  {
    id: 'lock-pdf',
    title: 'Lock PDF',
    description: 'Add password protection to secure PDF files',
    href: routes.pdfTools.lock,
    category: 'pdf',
    icon: 'pdf',
  },
  {
    id: 'unlock-pdf',
    title: 'Unlock PDF',
    description: 'Remove password protection from PDF files',
    href: routes.pdfTools.unlock,
    category: 'pdf',
    icon: 'pdf',
  },
  {
    id: 'rotate-pdf',
    title: 'Rotate PDF',
    description: 'Rotate PDF pages 90°, 180°, or 270°',
    href: routes.pdfTools.rotate,
    category: 'pdf',
    icon: 'pdf',
  },
  {
    id: 'add-page-numbers',
    title: 'Add Page Numbers',
    description: 'Add page numbers to PDF documents',
    href: routes.pdfTools.addPageNumbers,
    category: 'pdf',
    icon: 'pdf',
  },
];

export const categories = [
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Convert, compress, resize, and edit images',
    icon: 'image',
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'Work with PDF files - merge, split, convert',
    icon: 'pdf',
  },
  {
    id: 'text',
    name: 'Text Tools',
    description: 'Text manipulation and formatting tools',
    icon: 'text',
  },
  {
    id: 'generator',
    name: 'Generators',
    description: 'QR codes, barcodes, and more generators',
    icon: 'generator',
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    description: 'Tools for developers and programmers',
    icon: 'code',
  },
  {
    id: 'calculator',
    name: 'Calculators',
    description: 'Various calculation and conversion tools',
    icon: 'calculator',
  },
];

import React from 'react';

// Icon components mapping
export const getIcon = (iconName: string): React.ReactNode | null => {
  const icons: Record<string, React.ReactNode> = {
    qr: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
    image: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    compress: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    resize: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
    convert: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    pdf: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    imagePdf: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    barcode: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
    text: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    generator: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
    code: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    calculator: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  };

  return icons[iconName] || icons.image || null;
};

