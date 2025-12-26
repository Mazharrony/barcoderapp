'use client';

import { useState, useRef } from 'react';
import { compressPDF, getPDFInfo } from '@/lib/pdf-utils';

interface PDFFile {
  id: string;
  name: string;
  file: File;
  processedBlob?: Blob;
  originalSize: number;
  processedSize?: number;
  error?: string;
}

export default function CompressPDF() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState(80);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: PDFFile[] = selectedFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      file,
      originalSize: file.size,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);

    const processedFiles = await Promise.all(
      files.map(async (fileItem) => {
        try {
          const compressedBlob = await compressPDF(fileItem.file, compressionLevel);
          return {
            ...fileItem,
            processedBlob: compressedBlob,
            processedSize: compressedBlob.size,
            error: undefined,
          };
        } catch (error) {
          return {
            ...fileItem,
            error: error instanceof Error ? error.message : 'Compression failed',
          };
        }
      })
    );

    setFiles(processedFiles);
    setIsProcessing(false);
  };

  const handleDownload = (fileItem: PDFFile) => {
    if (!fileItem.processedBlob) return;

    const originalName = fileItem.name.replace('.pdf', '');
    const newFileName = `${originalName}-compressed.pdf`;

    const url = URL.createObjectURL(fileItem.processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const processedCount = files.filter(f => f.processedBlob).length;
  const hasResults = processedCount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <section className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Compress PDF Online - Free PDF Compressor Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            Reduce PDF file size without compromising quality using our free online PDF compressor. Perfect for email attachments, file sharing, or saving storage space. Process files instantly in your browser.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              Compress PDF
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Select PDF File(s)
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
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> pdf-lib doesn&apos;t support PDF compression directly. The file will be processed but compression may be limited. For better compression, consider using specialized tools.
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
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                style={{
                  background: `linear-gradient(to right, #2563EB 0%, #2563EB ${compressionLevel}%, #E5E7EB ${compressionLevel}%, #E5E7EB 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>10%</span>
                <span>100%</span>
              </div>
            </div>

            <button
              onClick={handleCompress}
              disabled={files.length === 0 || isProcessing}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mb-4"
            >
              {isProcessing ? 'Compressing...' : 'Compress PDFs'}
            </button>

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
                <p className="text-gray-600 dark:text-gray-400">No PDF files selected. Choose files to get started.</p>
              </div>
            ) : (
              files.map((fileItem) => (
                <div
                  key={fileItem.id}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {fileItem.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Original: {formatFileSize(fileItem.originalSize)}
                        {fileItem.processedSize && (
                          <span className="ml-2">
                            → {formatFileSize(fileItem.processedSize)} ({Math.round((1 - fileItem.processedSize / fileItem.originalSize) * 100)}% reduction)
                          </span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {fileItem.error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <p className="text-red-600 dark:text-red-400 text-sm">{fileItem.error}</p>
                    </div>
                  ) : fileItem.processedBlob ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <p className="text-green-700 dark:text-green-300 text-sm">
                          <strong>Compressed!</strong> File size reduced by {Math.round((1 - fileItem.processedSize! / fileItem.originalSize) * 100)}%
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownload(fileItem)}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Compressed PDF
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
                      <p className="text-gray-600 dark:text-gray-400">Ready to compress</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

