'use client';

import { PDFDocument, PDFPage, rgb, degrees } from 'pdf-lib';

export interface PDFPageInfo {
  pageNumber: number;
  width: number;
  height: number;
}

// Merge PDFs
export async function mergePDFs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }
  
  const pdfBytes = await mergedPdf.save();
  // @ts-expect-error - Uint8Array is valid for Blob but TypeScript types are strict
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Split PDF
export async function splitPDF(file: File, pages: number[]): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const blobs: Blob[] = [];
  
  // If no pages specified, split each page
  const pagesToExtract = pages.length > 0 ? pages : Array.from({ length: sourcePdf.getPageCount() }, (_, i) => i + 1);
  
  for (const pageNum of pagesToExtract) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageNum - 1]);
    newPdf.addPage(copiedPage);
    const pdfBytes = await newPdf.save();
    // @ts-expect-error - Uint8Array is valid for Blob but TypeScript types are strict
    blobs.push(new Blob([pdfBytes], { type: 'application/pdf' }));
  }
  
  return blobs;
}

// Compress PDF (Note: pdf-lib doesn't have built-in compression, this is a placeholder)
export async function compressPDF(file: File, quality: number): Promise<Blob> {
  // pdf-lib doesn't support compression directly
  // For real compression, you'd need a server-side solution or different library
  // This implementation just returns the original file
  // For actual compression, consider using a service or server-side processing
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pdfBytes = await pdf.save();
  // @ts-expect-error - Uint8Array is valid for Blob but TypeScript types are strict
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Lock PDF with password
export async function lockPDF(file: File, ownerPassword: string, userPassword?: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  
  // pdf-lib doesn't support password protection directly
  // This would require additional encryption libraries or server-side processing
  // For now, we'll return the PDF as-is with a note
  const pdfBytes = await pdf.save();
  
  // Note: Actual password protection requires PDF encryption which pdf-lib doesn't support
  // You would need to use a different library or server-side service
  // @ts-expect-error - Uint8Array is valid for Blob but TypeScript types are strict
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Unlock PDF
export async function unlockPDF(file: File, password: string): Promise<Blob> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Try to load with password (pdf-lib doesn't support password-protected PDFs directly)
    const pdf = await PDFDocument.load(arrayBuffer, { 
      ignoreEncryption: true,
      // Note: pdf-lib has limited support for encrypted PDFs
    });
    const pdfBytes = await pdf.save();
    // @ts-expect-error - Uint8Array is valid for Blob but TypeScript types are strict
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    throw new Error('Failed to unlock PDF. pdf-lib has limited support for password-protected PDFs. Consider using a server-side solution.');
  }
}

// Add page numbers
export async function addPageNumbers(file: File, options: {
  position: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  fontSize?: number;
  startPage?: number;
}): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  const fontSize = options.fontSize || 12;
  const startPage = options.startPage || 1;
  
  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const pageNumber = startPage + index;
    let x = 0;
    let y = 0;
    
    // Calculate position
    switch (options.position) {
      case 'top':
        x = width / 2;
        y = height - 20;
        break;
      case 'bottom':
        x = width / 2;
        y = 20;
        break;
      case 'top-left':
        x = 20;
        y = height - 20;
        break;
      case 'top-right':
        x = width - 20;
        y = height - 20;
        break;
      case 'bottom-left':
        x = 20;
        y = 20;
        break;
      case 'bottom-right':
        x = width - 20;
        y = 20;
        break;
    }
    
    page.drawText(pageNumber.toString(), {
      x: x - (fontSize * 0.3),
      y: y,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
  });
  
  const pdfBytes = await pdf.save();
  // @ts-expect-error - Uint8Array is valid for Blob but TypeScript types are strict
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Rotate PDF pages
export async function rotatePDFPages(file: File, pages: number[], angle: 90 | 180 | 270): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const allPages = pdf.getPages();
  
  const rotationAngle = angle === 90 ? degrees(90) : angle === 180 ? degrees(180) : degrees(270);
  
  if (pages.length === 0) {
    // Rotate all pages
    allPages.forEach((page) => {
      page.setRotation(rotationAngle);
    });
  } else {
    // Rotate specific pages
    pages.forEach((pageNum) => {
      if (pageNum > 0 && pageNum <= allPages.length) {
        allPages[pageNum - 1].setRotation(rotationAngle);
      }
    });
  }
  
  const pdfBytes = await pdf.save();
  // @ts-expect-error - Uint8Array is valid for Blob but TypeScript types are strict
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Get PDF info
export async function getPDFInfo(file: File): Promise<{ pageCount: number; pages: PDFPageInfo[] }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();
  
  const pageInfo: PDFPageInfo[] = pages.map((page, index) => {
    const { width, height } = page.getSize();
    return {
      pageNumber: index + 1,
      width,
      height,
    };
  });
  
  return {
    pageCount: pages.length,
    pages: pageInfo,
  };
}
