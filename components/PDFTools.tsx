'use client';

import { useState, useRef } from 'react';
import {
  mergePDFs,
  splitPDF,
  compressPDF,
  addPageNumbers,
  rotatePDFPages,
  getPDFInfo,
} from '@/lib/pdf-utils';

type PDFToolType = 
  | 'merge' 
  | 'split' 
  | 'compress' 
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

export default function PDFTools() {
  const [activeTool, setActiveTool] = useState<PDFToolType>('merge');
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Merge settings
  const [mergeOrder, setMergeOrder] = useState<string[]>([]);
  
  // Split settings
  const [splitPages, setSplitPages] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<PDFFile | null>(null);
  
  // Compress settings
  const [compressionLevel, setCompressionLevel] = useState(80);
  
  // Page numbers settings
  const [pageNumberPosition, setPageNumberPosition] = useState<'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('bottom');
  const [pageNumberFontSize, setPageNumberFontSize] = useState(12);
  const [startPage, setStartPage] = useState(1);
  
  // Rotate settings
  const [rotatePages, setRotatePages] = useState<string>('');
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, accept: string = 'application/pdf') => {
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

  // Merge PDFs
  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files to merge');
      return;
    }
    
    setIsProcessing(true);
    try {
      const pdfFiles = files.map(f => f.file);
      const mergedBlob = await mergePDFs(pdfFiles);
      
      // Store result instead of auto-downloading
      setFiles([{
        id: `merged-${Date.now()}`,
        name: `merged-${Date.now()}.pdf`,
        file: new File([mergedBlob], `merged-${Date.now()}.pdf`, { type: 'application/pdf' }),
        processedBlob: mergedBlob,
      }]);
    } catch (error) {
      setFiles([{
        id: `error-${Date.now()}`,
        name: 'Merge failed',
        file: files[0].file,
        error: error instanceof Error ? error.message : 'Merge failed',
      }]);
    }
    setIsProcessing(false);
  };

  // Split PDF
  const handleSplit = async () => {
    if (!selectedFile || !splitPages.trim()) {
      alert('Please select a PDF file and specify pages to extract');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Parse page numbers (e.g., "1,3,5-10")
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
      
      // Store all split PDFs as separate files
      const splitFiles: PDFFile[] = splitBlobs.map((blob, index) => ({
        id: `split-${Date.now()}-${index}`,
        name: `${selectedFile.name.replace('.pdf', '')}-pages-${pages[index]}.pdf`,
        file: new File([blob], `${selectedFile.name.replace('.pdf', '')}-pages-${pages[index]}.pdf`, { type: 'application/pdf' }),
        processedBlob: blob,
      }));
      
      setFiles(splitFiles);
    } catch (error) {
      setFiles([{
        ...selectedFile,
        error: error instanceof Error ? error.message : 'Split failed',
      }]);
    }
    setIsProcessing(false);
  };

  // Compress PDF
  const handleCompress = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file to optimize');
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

  // Add page numbers
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
      setFiles([{
        ...files[0],
        processedBlob: result,
      }]);
    } catch (error) {
      setFiles([{
        ...files[0],
        error: error instanceof Error ? error.message : 'Failed to add page numbers',
      }]);
    }
    setIsProcessing(false);
  };

  // Rotate pages
  const handleRotate = async () => {
    if (files.length === 0) {
      alert('Please select a PDF file');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Parse page numbers
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
      
      const result = await rotatePDFPages(files[0].file, pages.length > 0 ? pages : [], rotateAngle);
      setFiles([{
        ...files[0],
        processedBlob: result,
      }]);
    } catch (error) {
      setFiles([{
        ...files[0],
        error: error instanceof Error ? error.message : 'Rotation failed',
      }]);
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
  };

  const tools: { id: PDFToolType; name: string; icon: string; description: string }[] = [
    { id: 'merge', name: 'Merge PDF', icon: '📄', description: 'Combine multiple PDFs into one' },
    { id: 'split', name: 'Split PDF', icon: '✂️', description: 'Extract pages from PDF' },
    { id: 'compress', name: 'Optimize PDF (Light)', icon: '📦', description: 'Rebuild PDF with limited compression' },
    { id: 'page-numbers', name: 'Add Page Numbers', icon: '🔢', description: 'Add page numbers to PDF' },
    { id: 'rotate', name: 'Rotate Pages', icon: '🔄', description: 'Rotate PDF pages' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-12 text-center animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Professional PDF Tools
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
              Complete PDF<br />Processing Suite
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
              Merge, split, optimize, convert, lock, unlock, and more. All PDF tools in one place, completely free.
            </p>
          </div>
        </section>

        {/* Tools Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id);
                  clearAll();
                }}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  activeTool === tool.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={tool.description}
              >
                <span className="mr-2">{tool.icon}</span>
                {tool.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              Settings
            </h2>

            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select PDF File(s)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple={activeTool === 'merge' || activeTool === 'compress'}
                onChange={(e) => handleFileSelect(e, 'application/pdf')}
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
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Tool-specific controls */}
            {activeTool === 'merge' && (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Files will be merged in the order they appear below. Drag to reorder.
                  </p>
                  {files.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
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
            )}

            {activeTool === 'split' && (
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
            )}

            {activeTool === 'compress' && (
              <>
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Best results for image-heavy PDFs.</strong> This tool performs limited compression by rebuilding the PDF structure. For better compression, specialized server-side tools may be needed.
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
                  <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                    <span>Smaller Size</span>
                    <span>Better Quality</span>
                  </div>
                </div>
                <button
                  onClick={handleCompress}
                  disabled={files.length === 0 || isProcessing}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {isProcessing ? 'Processing...' : 'Process PDF'}
                </button>
              </>
            )}

            {activeTool === 'page-numbers' && (
              <>
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
            )}

            {activeTool === 'rotate' && (
              <>
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
            )}

            {files.length > 0 && (
              <button
                onClick={clearAll}
                className="w-full mt-4 py-2 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Files List */}
          <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Files ({files.length})
              </h2>
              {isProcessing && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Processing...</span>
                </div>
              )}
              {!isProcessing && files.some(f => f.processedBlob) && (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Ready to Download</span>
                </div>
              )}
            </div>

            {files.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium">No files selected</p>
                <p className="text-sm mt-2">Upload PDF files to get started</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {files.map((fileItem) => (
                  <div
                    key={fileItem.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex-shrink-0 relative">
                      {fileItem.processedBlob ? (
                        <div className="w-16 h-20 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center border-2 border-green-500 dark:border-green-400">
                          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      ) : isProcessing ? (
                        <div className="w-16 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center border-2 border-blue-300 dark:border-blue-700">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                        </div>
                      ) : (
                        <div className="w-16 h-20 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center border-2 border-gray-300 dark:border-gray-500">
                          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {fileItem.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(fileItem.file.size / 1024).toFixed(2)} KB
                        {fileItem.pageCount && ` • ${fileItem.pageCount} pages`}
                      </p>
                      {fileItem.error && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fileItem.error}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {fileItem.processedBlob ? (
                        <button
                          onClick={() => {
                            const url = URL.createObjectURL(fileItem.processedBlob!);
                            const link = document.createElement('a');
                            link.href = url;
                            const suffix = activeTool === 'merge' ? '-merged' : 
                                         activeTool === 'compress' ? '-optimized' :
                                         activeTool === 'page-numbers' ? '-numbered' :
                                         activeTool === 'rotate' ? '-rotated' : '-processed';
                            link.download = fileItem.name.replace('.pdf', `${suffix}.pdf`);
                            link.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all text-sm font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download
                        </button>
                      ) : isProcessing ? (
                        <div className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                          Ready
                        </div>
                      )}
                      <button
                        onClick={() => removeFile(fileItem.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove file"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-16">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Implementation Status
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>
              <strong>✅ Fully Working:</strong> Merge PDF, Split PDF, Add Page Numbers, Rotate Pages
            </p>
            <p>
              <strong>⚠️ Limited:</strong> Optimize PDF (Light) - pdf-lib has limited compression support. For better compression, specialized tools may be needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

