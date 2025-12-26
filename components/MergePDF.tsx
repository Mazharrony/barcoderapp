'use client';

import { useState, useRef } from 'react';
import { mergePDFs, getPDFInfo } from '@/lib/pdf-utils';

interface PDFFile {
  id: string;
  name: string;
  file: File;
  pageCount?: number;
  fileSize: number;
}

export default function MergePDF() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setError(null);
    
    const newFiles: PDFFile[] = [];
    for (const file of selectedFiles) {
      try {
        const info = await getPDFInfo(file);
        newFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          file,
          pageCount: info.pageCount,
          fileSize: file.size,
        });
      } catch (err) {
        setError(`Failed to load ${file.name}: ${err instanceof Error ? err.message : 'Invalid PDF'}`);
      }
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      const pdfFiles = files.map(f => f.file);
      const merged = await mergePDFs(pdfFiles);
      setMergedBlob(merged);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Merge failed');
    }
    
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!mergedBlob) return;

    const url = URL.createObjectURL(mergedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const moveFile = (id: string, direction: 'up' | 'down') => {
    setFiles(prev => {
      const index = prev.findIndex(f => f.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;
      
      const newFiles = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
      return newFiles;
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (files.length === 1) {
      setMergedBlob(null);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setMergedBlob(null);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const totalPages = files.reduce((sum, f) => sum + (f.pageCount || 0), 0);
  const totalSize = files.reduce((sum, f) => sum + f.fileSize, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <section className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Merge PDF Files Online - Free PDF Merger Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            Combine multiple PDF documents into a single file instantly with our free online PDF merger. No software installation, no registration required - just upload your PDFs and merge them in seconds.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Merge PDF
            </h2>

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
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {files.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  <strong>Total:</strong> {files.length} file{files.length !== 1 ? 's' : ''}, {totalPages} page{totalPages !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Size:</strong> {formatFileSize(totalSize)}
                </p>
              </div>
            )}

            <button
              onClick={handleMerge}
              disabled={files.length < 2 || isProcessing}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mb-4"
            >
              {isProcessing ? 'Merging...' : 'Merge PDFs'}
            </button>

            {mergedBlob && (
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors mb-4"
              >
                Download Merged PDF
              </button>
            )}

            {files.length > 0 && (
              <button
                onClick={clearAll}
                className="w-full py-2 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            {files.length === 0 ? (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">No PDF files selected. Choose at least 2 files to merge.</p>
              </div>
            ) : (
              <>
                {files.map((fileItem, index) => (
                  <div
                    key={fileItem.id}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {fileItem.name}
                          </h3>
                        </div>
                        <div className="ml-11 space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Pages: {fileItem.pageCount || 'Loading...'} • Size: {formatFileSize(fileItem.fileSize)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => moveFile(fileItem.id, 'up')}
                          disabled={index === 0}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => moveFile(fileItem.id, 'down')}
                          disabled={index === files.length - 1}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => removeFile(fileItem.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {mergedBlob && (
                  <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-3xl shadow-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-xl font-bold text-green-700 dark:text-green-300">PDF Merged Successfully!</h3>
                    </div>
                    <p className="text-green-700 dark:text-green-300 mb-4">
                      Your {files.length} PDF{files.length !== 1 ? 's' : ''} have been merged into one document with {totalPages} total pages.
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                      Merged file size: {formatFileSize(mergedBlob.size)}
                    </p>
                    <button
                      onClick={handleDownload}
                      className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Merged PDF
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* SEO Content Sections */}
        <div className="space-y-8 mb-16">
          {/* Features Section */}
          <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unlimited PDF Merging</h3>
                  <p className="text-gray-700 dark:text-gray-300">Merge as many PDF files as you need in a single operation. No limits on the number of files or pages you can combine.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Drag & Drop Reordering</h3>
                  <p className="text-gray-700 dark:text-gray-300">Easily rearrange PDF files before merging. Control the exact order of pages in your final merged document.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quality Preservation</h3>
                  <p className="text-gray-700 dark:text-gray-300">Maintain original quality and formatting. Text, images, and layout remain exactly as they were in the original PDFs.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">100% Secure</h3>
                  <p className="text-gray-700 dark:text-gray-300">All processing happens in your browser. Your PDFs are never uploaded to any server, ensuring complete privacy and security.</p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">How It Works</h2>
            <ol className="space-y-6">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg">1</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload PDF Files</h3>
                  <p className="text-gray-700 dark:text-gray-300">Select two or more PDF files from your device. You can upload as many PDFs as you need to merge.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg">2</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Arrange Files</h3>
                  <p className="text-gray-700 dark:text-gray-300">Use the up and down arrows to reorder your PDF files. The order determines how pages appear in the merged document.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg">3</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Merge PDFs</h3>
                  <p className="text-gray-700 dark:text-gray-300">Click the merge button and watch as your PDFs are combined instantly in your browser. No waiting, no uploads.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg">4</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Download Merged PDF</h3>
                  <p className="text-gray-700 dark:text-gray-300">Preview the merged document information and download your combined PDF file instantly.</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Use Cases Section */}
          <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Common Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Combine Reports</h3>
                <p className="text-gray-700 dark:text-gray-300">Merge multiple monthly or quarterly reports into a single comprehensive document for easy review and sharing.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Join Scanned Documents</h3>
                <p className="text-gray-700 dark:text-gray-300">Combine multiple scanned pages or documents into one PDF file for better organization and management.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Merge Book Chapters</h3>
                <p className="text-gray-700 dark:text-gray-300">Combine separate chapter PDFs into a complete book or manual for easier reading and distribution.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Combine Invoices</h3>
                <p className="text-gray-700 dark:text-gray-300">Merge multiple invoices or receipts into a single PDF for simplified record-keeping and accounting.</p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How many PDF files can I merge at once?</h3>
                <p className="text-gray-700 dark:text-gray-300">You can merge as many PDF files as you need. There's no limit to the number of files you can combine in a single operation. However, very large files may take longer to process.</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Will merging PDFs reduce the quality?</h3>
                <p className="text-gray-700 dark:text-gray-300">No, our PDF merger preserves the original quality of all your documents. Text, images, and formatting remain exactly as they were in the original files.</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Is it safe to merge PDFs online?</h3>
                <p className="text-gray-700 dark:text-gray-300">Yes, all processing happens in your browser. Your files are never uploaded to our servers, ensuring complete privacy and security for your sensitive documents.</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I merge password-protected PDFs?</h3>
                <p className="text-gray-700 dark:text-gray-300">Currently, our tool works best with unprotected PDFs. Password-protected files may require unlocking first using our Unlock PDF tool.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What file size limits apply?</h3>
                <p className="text-gray-700 dark:text-gray-300">The tool works with files of any size, though very large files may take longer to process depending on your device's capabilities. For best performance, consider files under 100MB each.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

