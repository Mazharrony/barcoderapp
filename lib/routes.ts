/**
 * Centralized Route Configuration
 * 
 * This file contains all route definitions for the application.
 * Use these constants instead of hardcoding paths throughout the codebase.
 */

export const routes = {
  // Home
  home: '/',
  
  // Category Pages
  categories: {
    image: '/image-tools',
    pdf: '/pdf-tools',
    tools: '/tools',
    categories: '/categories',
    services: '/services',
    blog: '/blog',
    contact: '/contact',
  },
  
  // Image Tools - Detail Pages
  imageTools: {
    compressor: '/image-tools/compressor',
    converter: '/image-tools/converter',
    resizer: '/image-tools/resizer',
    cropper: '/image-tools/cropper',
    imageToPdf: '/image-tools/image-to-pdf',
    pdfToImage: '/image-tools/pdf-to-image',
    heicToJpg: '/image-tools/heic-to-jpg',
    bgRemover: '/image-tools/bg-remover',
  },
  
  // PDF Tools - Detail Pages
  pdfTools: {
    merge: '/pdf-tools/merge-pdf',
    split: '/pdf-tools/split-pdf',
    compress: '/pdf-tools/compress-pdf',
    lock: '/pdf-tools/lock-pdf',
    unlock: '/pdf-tools/unlock-pdf',
    addPageNumbers: '/pdf-tools/add-page-numbers',
    rotate: '/pdf-tools/rotate-pdf',
  },
  
  // Standalone Tools
  standalone: {
    qrGenerator: '/qr-code-generator',
    barcodeGenerator: '/barcode-generator',
    pngToJpeg: '/png-to-jpeg',
  },
} as const;

/**
 * Helper function to get route by tool ID
 */
export function getRouteByToolId(toolId: string): string {
  const routeMap: Record<string, string> = {
    // Image tools
    'image-compressor': routes.imageTools.compressor,
    'image-converter': routes.imageTools.converter,
    'image-resizer': routes.imageTools.resizer,
    'image-cropper': routes.imageTools.cropper,
    'image-to-pdf': routes.imageTools.imageToPdf,
    'pdf-to-image': routes.imageTools.pdfToImage,
    'heic-to-jpg': routes.imageTools.heicToJpg,
    'bg-remover': routes.imageTools.bgRemover,
    
    // PDF tools
    'merge-pdf': routes.pdfTools.merge,
    'split-pdf': routes.pdfTools.split,
    'compress-pdf': routes.pdfTools.compress,
    'lock-pdf': routes.pdfTools.lock,
    'unlock-pdf': routes.pdfTools.unlock,
    'add-page-numbers': routes.pdfTools.addPageNumbers,
    'rotate-pdf': routes.pdfTools.rotate,
    
    // Standalone
    'qr-code-generator': routes.standalone.qrGenerator,
    'barcode-generator': routes.standalone.barcodeGenerator,
    'png-to-jpeg': routes.standalone.pngToJpeg,
  };
  
  return routeMap[toolId] || routes.home;
}

/**
 * Get category route by tool category
 */
export function getCategoryRoute(category: string): string {
  const categoryMap: Record<string, string> = {
    image: routes.categories.image,
    pdf: routes.categories.pdf,
    generator: routes.categories.tools,
    text: routes.categories.tools,
    developer: routes.categories.tools,
    calculator: routes.categories.tools,
  };
  
  return categoryMap[category] || routes.categories.tools;
}

/**
 * Get related tools for a given tool ID
 */
export function getRelatedTools(toolId: string): string[] {
  const relatedMap: Record<string, string[]> = {
    // Image tools related to each other
    'image-compressor': [
      routes.imageTools.converter,
      routes.imageTools.resizer,
      routes.imageTools.cropper,
    ],
    'image-converter': [
      routes.imageTools.compressor,
      routes.imageTools.resizer,
      routes.imageTools.imageToPdf,
    ],
    'image-resizer': [
      routes.imageTools.compressor,
      routes.imageTools.cropper,
      routes.imageTools.converter,
    ],
    'image-cropper': [
      routes.imageTools.resizer,
      routes.imageTools.compressor,
      routes.imageTools.bgRemover,
    ],
    
    // PDF tools related to each other
    'merge-pdf': [
      routes.pdfTools.split,
      routes.pdfTools.compress,
      routes.pdfTools.rotate,
    ],
    'split-pdf': [
      routes.pdfTools.merge,
      routes.pdfTools.compress,
      routes.pdfTools.rotate,
    ],
    
    // Generators related to each other
    'qr-code-generator': [
      routes.standalone.barcodeGenerator,
    ],
    'barcode-generator': [
      routes.standalone.qrGenerator,
    ],
  };
  
  return relatedMap[toolId] || [];
}



