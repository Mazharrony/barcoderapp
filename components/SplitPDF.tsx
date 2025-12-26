'use client';

import { useState, useRef } from 'react';
import { splitPDF, getPDFInfo } from '@/lib/pdf-utils';
import JSZip from 'jszip';

interface PDFFile {
  id: string;
  name: string;
  file: File;
  pageCount?: number;
  fileSize: number;
}

interface SplitResult {
  blob: Blob;
  pageNumber: number;
}

export default function SplitPDF() {
  const [file, setFile] = useState<PDFFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitPages, setSplitPages] = useState<string>('');
  const [results, setResults] = useState<SplitResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);
    setResults([]);
    
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

  const parsePages = (input: string): number[] => {
    const pages: number[] = [];
    const parts = input.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (start && end && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i > 0 && (!file?.pageCount || i <= file.pageCount)) {
              pages.push(i);
            }
          }
        }
      } else {
        const page = Number(part);
        if (page > 0 && (!file?.pageCount || page <= file.pageCount)) {
          pages.push(page);
        }
      }
    }
    
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || !splitPages.trim()) {
      setError('Please select a PDF file and specify pages to extract');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const pages = parsePages(splitPages);
      if (pages.length === 0) {
        setError('Invalid page numbers. Please check your input.');
        setIsProcessing(false);
        return;
      }

      const splitBlobs = await splitPDF(file.file, pages);
      
      const splitResults: SplitResult[] = splitBlobs.map((blob, index) => ({
        blob,
        pageNumber: pages[index],
      }));
      
      setResults(splitResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Split failed');
    }
    
    setIsProcessing(false);
  };

  const handleDownload = (result: SplitResult) => {
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace('.pdf', '')}-page-${result.pageNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    if (results.length === 0) return;

    const zip = new JSZip();
    results.forEach((result) => {
      const fileName = `${file?.name.replace('.pdf', '')}-page-${result.pageNumber}.pdf`;
      zip.file(fileName, result.blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.replace('.pdf', '')}-split-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFile(null);
    setSplitPages('');
    setResults([]);
    setError(null);
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
            Split PDF Online - Free PDF Splitter Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            Extract specific pages from PDF documents instantly with our free online PDF splitter. Select individual pages or page ranges to create separate PDF files. No software installation needed.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                </svg>
              </div>
              Split PDF
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
                Enter page numbers separated by commas, or ranges like &quot;1-5&quot;. Example: 1,3,5-10,15
              </p>
              {file?.pageCount && (
                <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  PDF has {file.pageCount} page{file.pageCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleSplit}
              disabled={!file || !splitPages.trim() || isProcessing}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mb-4"
            >
              {isProcessing ? 'Splitting...' : 'Split PDF'}
            </button>

            {results.length > 0 && (
              <button
                onClick={handleDownloadAll}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors mb-4"
              >
                Download All ({results.length})
              </button>
            )}

            {(file || results.length > 0) && (
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
            ) : results.length > 0 ? (
              <>
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-3xl shadow-2xl p-6 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-bold text-green-700 dark:text-green-300">
                      Successfully extracted {results.length} page{results.length !== 1 ? 's' : ''}
                    </h3>
                  </div>
                </div>
                {results.map((result) => (
                  <div
                    key={result.pageNumber}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          Page {result.pageNumber}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Size: {formatFileSize(result.blob.size)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownload(result)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </>
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
                  <p className="text-gray-600 dark:text-gray-400">Enter page numbers above and click &quot;Split PDF&quot; to extract pages.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

