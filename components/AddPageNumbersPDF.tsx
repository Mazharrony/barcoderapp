'use client';

import { useState, useRef } from 'react';
import { addPageNumbers, getPDFInfo } from '@/lib/pdf-utils';

interface PDFFile {
  id: string;
  name: string;
  file: File;
  pageCount?: number;
  fileSize: number;
}

export default function AddPageNumbersPDF() {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('bottom');
  const [fontSize, setFontSize] = useState(12);
  const [startPage, setStartPage] = useState(1);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setProcessedBlob(null);
    
    try {
      const info = await getPDFInfo(selectedFile);
      setFile({
        id: 'selected',
        name: selectedFile.name,
        file: selectedFile,
        pageCount: info.pageCount,
        fileSize: selectedFile.size,
      });
    } catch (err) {
      setError(`Failed to load PDF: ${err instanceof Error ? err.message : 'Invalid PDF'}`);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPageNumbers = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const result = await addPageNumbers(file.file, {
        position,
        fontSize,
        startPage,
      });
      setProcessedBlob(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add page numbers');
    }
    
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!processedBlob) return;

    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace('.pdf', '')}-numbered.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFile(null);
    setProcessedBlob(null);
    setError(null);
    setPosition('bottom');
    setFontSize(12);
    setStartPage(1);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <section className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Add Page Numbers to PDF - Free Online Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            Add page numbers to PDF documents instantly with our free online tool. Customize position, font size, and starting page number. Perfect for professional documents and reports.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              Add Page Numbers
            </h2>

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
              {file && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>{file.name}</strong>
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {file.pageCount} pages • {formatFileSize(file.fileSize)}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as typeof position)}
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
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
                <input
                  type="number"
                  min="8"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Page</label>
                <input
                  type="number"
                  min="1"
                  value={startPage}
                  onChange={(e) => setStartPage(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleAddPageNumbers}
              disabled={!file || isProcessing}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mb-4"
            >
              {isProcessing ? 'Adding...' : 'Add Page Numbers'}
            </button>

            {processedBlob && (
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors mb-4"
              >
                Download Numbered PDF
              </button>
            )}

            {(file || processedBlob) && (
              <button
                onClick={clearAll}
                className="w-full py-2 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {!file ? (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">No PDF file selected. Choose a file to get started.</p>
              </div>
            ) : processedBlob ? (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-3xl shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-300">Page Numbers Added Successfully!</h3>
                </div>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Page numbers have been added to all {file.pageCount} pages at {position.replace('-', ' ')} position.
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                  File size: {formatFileSize(processedBlob.size)}
                </p>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Numbered PDF
                </button>
              </div>
            ) : (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {file.pageCount} pages • {formatFileSize(file.fileSize)}
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">Configure page number settings and click &quot;Add Page Numbers&quot;.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

