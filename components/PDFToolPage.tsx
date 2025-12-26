'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  mergePDFs,
  splitPDF,
  compressPDF,
  lockPDF,
  unlockPDF,
  addPageNumbers,
  rotatePDFPages,
} from '@/lib/pdf-utils';

type PDFToolType = 
  | 'merge' 
  | 'split' 
  | 'compress' 
  | 'lock' 
  | 'unlock' 
  | 'page-numbers' 
  | 'rotate';

interface PDFFile {
  id: string;
  name: string;
  file: File;
  processedBlob?: Blob;
  error?: string;
  pageCount?: number;
}

interface SEOContent {
  h1: string;
  intro: string;
  features: string[];
  howItWorks: string[];
  useCases: string[];
  faq: { question: string; answer: string }[];
}

interface PDFToolPageProps {
  toolId: PDFToolType;
  toolName: string;
  toolDescription: string;
  seoContent: SEOContent;
}

export default function PDFToolPage({ toolId, toolName, toolDescription, seoContent }: PDFToolPageProps) {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Split settings
  const [splitPages, setSplitPages] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null);
  
  // Compress settings
  const [compressionLevel, setCompressionLevel] = useState(80);
  
  // Lock settings
  const [ownerPassword, setOwnerPassword] = useState('');
  const [userPassword, setUserPassword] = useState('');
  
  // Unlock settings
  const [unlockPassword, setUnlockPassword] = useState('');
  
  // Page numbers settings
  const [pageNumberPosition, setPageNumberPosition] = useState<'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('bottom');
  const [pageNumberFontSize, setPageNumberFontSize] = useState(12);
  const [startPage, setStartPage] = useState(1);
  
  // Rotate settings
  const [rotatePages, setRotatePages] = useState<string>('');
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: PDFFile[] = selectedFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      file,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files to merge');
      return;
    }
    
    setIsProcessing(true);
    try {
      const pdfFiles = files.map(f => f.file);
      const mergedBlob = await mergePDFs(pdfFiles);
      
      const url = URL.createObjectURL(mergedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Merge failed');
    }
    setIsProcessing(false);
  };

  const handleSplit = async () => {
    if (!selectedFile || !splitPages.trim()) {
      alert('Please select a PDF file and specify pages to extract');
      return;
    }
    
    setIsProcessing(true);
    try {
      const pages: number[] = [];
      const parts = splitPages.split(',');
      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            pages.push(i);
          }
        } else {
          pages.push(Number(part));
        }
      }
      
      const splitBlobs = await splitPDF(selectedFile.file, pages);
      
      for (let i = 0; i < splitBlobs.length; i++) {
        const url = URL.createObjectURL(splitBlobs[i]);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedFile.name.replace('.pdf', '')}-pages-${pages[i]}.pdf`;
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Split failed');
    }
    setIsProcessing(false);
  };

  const handleCompress = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to compress');
      return;
    }
    
    setIsProcessing(true);
    const processed: PDFFile[] = [];
    
    for (const fileItem of files) {
      try {
        const compressedBlob = await compressPDF(fileItem.file, compressionLevel);
        processed.push({
          ...fileItem,
          processedBlob: compressedBlob,
        });
      } catch (error) {
        processed.push({
          ...fileItem,
          error: error instanceof Error ? error.message : 'Compression failed',
        });
      }
    }
    
    setFiles(processed);
    setIsProcessing(false);
  };

  const handleLock = async () => {
    if (files.length === 0 || !ownerPassword) {
      alert('Please select a PDF file and enter a password');
      return;
    }
    
    setIsProcessing(true);
    try {
      const lockedBlob = await lockPDF(files[0].file, ownerPassword, userPassword || undefined);
      const url = URL.createObjectURL(lockedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${files[0].name.replace('.pdf', '')}-locked.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Locking failed');
    }
    setIsProcessing(false);
  };

  const handleUnlock = async () => {
    if (files.length === 0 || !unlockPassword) {
      alert('Please select a PDF file and enter the password');
      return;
    }
    
    setIsProcessing(true);
    try {
      const unlockedBlob = await unlockPDF(files[0].file, unlockPassword);
      const url = URL.createObjectURL(unlockedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${files[0].name.replace('.pdf', '')}-unlocked.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unlocking failed');
    }
    setIsProcessing(false);
  };

  const handleAddPageNumbers = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }
    
    setIsProcessing(true);
    try {
      const result = await addPageNumbers(files[0].file, {
        position: pageNumberPosition,
        fontSize: pageNumberFontSize,
        startPage: startPage,
      });
      const url = URL.createObjectURL(result);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${files[0].name.replace('.pdf', '')}-numbered.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to add page numbers');
    }
    setIsProcessing(false);
  };

  const handleRotate = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }
    
    setIsProcessing(true);
    try {
      const pages: number[] = [];
      if (rotatePages.trim()) {
        const parts = rotatePages.split(',');
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            for (let i = start; i <= end; i++) {
              pages.push(i);
            }
          } else {
            pages.push(Number(part));
          }
        }
      }
      
      const result = await rotatePDFPages(files[0].file, pages, rotateAngle);
      const url = URL.createObjectURL(result);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${files[0].name.replace('.pdf', '')}-rotated.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Rotation failed');
    }
    setIsProcessing(false);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setSelectedFile(null);
    setSplitPages('');
    setOwnerPassword('');
    setUserPassword('');
    setUnlockPassword('');
  };

  const renderToolControls = () => {
    switch (toolId) {
      case 'merge':
        return (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select PDF Files (2 or more)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
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
              {files.length > 0 && (
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={file.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-xs">
                      <span className="text-gray-500 dark:text-gray-400">{index + 1}.</span>
                      <span className="flex-1 truncate text-gray-700 dark:text-gray-300">{file.name}</span>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isProcessing ? 'Merging...' : 'Merge PDFs'}
            </button>
          </>
        );
      
      case 'split':
        return (
          <>
            {files.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Select PDF to Split
                </label>
                <select
                  value={selectedFile?.id || ''}
                  onChange={(e) => setSelectedFile(files.find(f => f.id === e.target.value) || null)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Choose a file...</option>
                  {files.map(file => (
                    <option key={file.id} value={file.id}>{file.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select PDF File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
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
                Choose File
              </label>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Pages to Extract
              </label>
              <input
                type="text"
                value={splitPages}
                onChange={(e) => setSplitPages(e.target.value)}
                placeholder="e.g., 1,3,5-10"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Enter page numbers separated by commas, or ranges like &quot;1-5&quot;
              </p>
            </div>
            <button
              onClick={handleSplit}
              disabled={!selectedFile || !splitPages.trim() || isProcessing}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isProcessing ? 'Splitting...' : 'Split PDF'}
            </button>
          </>
        );
      
      case 'compress':
        return (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select PDF File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
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
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> pdf-lib doesn&apos;t support PDF compression. For actual compression, server-side processing or specialized libraries are required.
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Compression Level: {compressionLevel}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                disabled
              />
            </div>
            <button
              onClick={handleCompress}
              disabled={files.length === 0 || isProcessing}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isProcessing ? 'Processing...' : 'Process PDF'}
            </button>
          </>
        );
      
      case 'lock':
        return (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select PDF File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
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
                Choose File
              </label>
            </div>
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> pdf-lib doesn&apos;t support password protection. For actual encryption, use specialized libraries or server-side processing.
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Owner Password (Required)
              </label>
              <input
                type="password"
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                User Password (Optional)
              </label>
              <input
                type="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Optional - for viewing only"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleLock}
              disabled={files.length === 0 || !ownerPassword || isProcessing}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isProcessing ? 'Processing...' : 'Process PDF'}
            </button>
          </>
        );
      
      case 'unlock':
        return (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select PDF File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
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
                Choose File
              </label>
            </div>
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> pdf-lib has limited support for password-protected PDFs. For reliable unlocking, use specialized tools or server-side processing.
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                PDF Password
              </label>
              <input
                type="password"
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                placeholder="Enter PDF password"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleUnlock}
              disabled={files.length === 0 || !unlockPassword || isProcessing}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isProcessing ? 'Unlocking...' : 'Unlock PDF'}
            </button>
          </>
        );
      
      case 'page-numbers':
        return (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select PDF File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
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
                Choose File
              </label>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Position
              </label>
              <select
                value={pageNumberPosition}
                onChange={(e) => setPageNumberPosition(e.target.value as any)}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="top">Top Center</option>
                <option value="bottom">Bottom Center</option>
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Font Size</label>
                <input
                  type="number"
                  min="8"
                  max="24"
                  value={pageNumberFontSize}
                  onChange={(e) => setPageNumberFontSize(parseInt(e.target.value) || 12)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Start Page</label>
                <input
                  type="number"
                  min="1"
                  value={startPage}
                  onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleAddPageNumbers}
              disabled={files.length === 0 || isProcessing}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isProcessing ? 'Adding...' : 'Add Page Numbers'}
            </button>
          </>
        );
      
      case 'rotate':
        return (
          <>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select PDF File
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
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
                Choose File
              </label>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Pages to Rotate
              </label>
              <input
                type="text"
                value={rotatePages}
                onChange={(e) => setRotatePages(e.target.value)}
                placeholder="e.g., 1,3,5-10 (leave empty for all)"
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Leave empty to rotate all pages
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Rotation Angle
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([90, 180, 270] as const).map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setRotateAngle(angle)}
                    className={`px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                      rotateAngle === angle
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {angle}°
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleRotate}
              disabled={files.length === 0 || isProcessing}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {isProcessing ? 'Rotating...' : 'Rotate Pages'}
            </button>
          </>
        );
      
      default:
        return null;
    }
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Other PDF Tools</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Merge PDF', href: '/pdf-tools/merge-pdf' },
                  { name: 'Split PDF', href: '/pdf-tools/split-pdf' },
                  { name: 'Compress PDF', href: '/pdf-tools/compress-pdf' },
                  { name: 'Lock PDF', href: '/pdf-tools/lock-pdf' },
                  { name: 'Unlock PDF', href: '/pdf-tools/unlock-pdf' },
                  { name: 'Add Page Numbers', href: '/pdf-tools/add-page-numbers' },
                  { name: 'Rotate PDF', href: '/pdf-tools/rotate-pdf' },
                ].filter(tool => tool.href !== `/pdf-tools/${toolId === 'page-numbers' ? 'add-page-numbers' : toolId === 'merge' ? 'merge-pdf' : toolId === 'split' ? 'split-pdf' : toolId === 'compress' ? 'compress-pdf' : toolId === 'lock' ? 'lock-pdf' : toolId === 'unlock' ? 'unlock-pdf' : 'rotate-pdf'}`).map((tool) => (
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

