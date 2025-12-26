'use client';

import { useState, useRef } from 'react';
import { convertImageFormat } from '@/lib/image-utils';
import JSZip from 'jszip';

interface ProcessedFile {
  id: string;
  originalName: string;
  file: File;
  processedBlob?: Blob;
  processedDataUrl?: string;
  originalSize: number;
  processedSize?: number;
  error?: string;
}

export default function ImageConverter() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [quality, setQuality] = useState(90);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: ProcessedFile[] = selectedFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      originalName: file.name,
      file,
      originalSize: file.size,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    const qualityDecimal = quality / 100;

    const processedFiles = await Promise.all(
      files.map(async (fileItem) => {
        try {
          const result = await convertImageFormat(
            fileItem.file,
            targetFormat,
            qualityDecimal,
            targetFormat === 'jpeg' ? backgroundColor : undefined
          );

          return {
            ...fileItem,
            processedBlob: result.blob,
            processedDataUrl: result.dataUrl,
            processedSize: result.blob.size,
            error: undefined,
          };
        } catch (error) {
          return {
            ...fileItem,
            error: error instanceof Error ? error.message : 'Conversion failed',
          };
        }
      })
    );

    setFiles(processedFiles);
    setIsProcessing(false);
  };

  const handleDownload = (fileItem: ProcessedFile) => {
    if (!fileItem.processedBlob) return;

    const extension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;
    const originalName = fileItem.originalName.split('.')[0];
    const newFileName = `${originalName}.${extension}`;

    const url = URL.createObjectURL(fileItem.processedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = newFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    if (files.filter(f => f.processedBlob).length === 0) return;

    const zip = new JSZip();
    const extension = targetFormat === 'jpeg' ? 'jpg' : targetFormat;

    files.forEach((fileItem) => {
      if (fileItem.processedBlob) {
        const originalName = fileItem.originalName.split('.')[0];
        const newFileName = `${originalName}.${extension}`;
        zip.file(newFileName, fileItem.processedBlob);
      }
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-images-${Date.now()}.zip`;
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
        {/* Hero Section */}
        <section className="mb-12 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Image Converter - Free Online Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            Convert images between JPG, PNG, and WEBP formats instantly with our free online image converter. Change image formats without losing quality. Perfect for web optimization and format compatibility.
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
              Image Converter
            </h2>

            {/* File Selection */}
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
              {files.length > 0 && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Format Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Target Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['jpeg', 'png', 'webp'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setTargetFormat(format)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      targetFormat === format
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality Slider */}
            {targetFormat !== 'png' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Quality: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  style={{
                    background: `linear-gradient(to right, #2563EB 0%, #2563EB ${quality}%, #E5E7EB ${quality}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>10%</span>
                  <span>100%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  PNG format uses lossless compression (quality not applicable)
                </p>
              </div>
            )}
            {targetFormat === 'png' && (
              <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  PNG uses lossless compression - quality settings don't apply
                </p>
              </div>
            )}

            {/* Background Color (only for JPEG) */}
            {targetFormat === 'jpeg' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Background Color (for transparency)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-16 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              disabled={files.length === 0 || isProcessing}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mb-4"
            >
              {isProcessing ? 'Converting...' : 'Convert Images'}
            </button>

            {/* Download All Button */}
            {hasResults && (
              <button
                onClick={handleDownloadAll}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors mb-4"
              >
                Download All ({processedCount})
              </button>
            )}

            {/* Clear Button */}
            {files.length > 0 && (
              <button
                onClick={clearAll}
                className="w-full py-2 px-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-4">
            {files.length === 0 ? (
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">No images selected. Choose files to get started.</p>
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
                        {fileItem.originalName}
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
                  ) : fileItem.processedDataUrl ? (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img
                          src={fileItem.processedDataUrl}
                          alt="Converted"
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      </div>
                      <button
                        onClick={() => handleDownload(fileItem)}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download {targetFormat.toUpperCase()}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
                      <p className="text-gray-600 dark:text-gray-400">Ready to convert</p>
                    </div>
                  )}
                </div>
              ))
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multiple Format Support</h3>
                  <p className="text-gray-700 dark:text-gray-300">Convert between JPEG, PNG, and WEBP formats instantly. Support for all major image formats used on the web and in print.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Quality Control</h3>
                  <p className="text-gray-700 dark:text-gray-300">Adjustable quality settings from 10% to 100% for JPEG and WEBP formats. Maintain perfect balance between file size and image quality.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Batch Processing</h3>
                  <p className="text-gray-700 dark:text-gray-300">Convert multiple images at once. Process entire folders of images in a single operation, saving time and effort.</p>
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
                  <p className="text-gray-700 dark:text-gray-300">All processing happens in your browser. Your images are never uploaded to any server, ensuring complete privacy and security.</p>
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upload Your Images</h3>
                  <p className="text-gray-700 dark:text-gray-300">Select one or multiple image files from your device. Supported formats include JPEG, PNG, WEBP, and more.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg">2</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Choose Target Format</h3>
                  <p className="text-gray-700 dark:text-gray-300">Select your desired output format: JPEG, PNG, or WEBP. Adjust quality settings and background color if needed.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg">3</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Convert Images</h3>
                  <p className="text-gray-700 dark:text-gray-300">Click the convert button and watch as your images are processed instantly in your browser. No waiting, no uploads.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold text-lg">4</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Download Results</h3>
                  <p className="text-gray-700 dark:text-gray-300">Preview your converted images and download them individually or as a ZIP file containing all converted images.</p>
                </div>
              </li>
            </ol>
          </section>

          {/* Use Cases Section */}
          <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Common Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Web Development</h3>
                <p className="text-gray-700 dark:text-gray-300">Convert images to WEBP format for faster website loading times and better performance. Optimize images for modern web browsers.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Print Media</h3>
                <p className="text-gray-700 dark:text-gray-300">Convert images to JPEG or PNG format for print publications, ensuring compatibility with printing software and services.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Social Media</h3>
                <p className="text-gray-700 dark:text-gray-300">Optimize images for different social media platforms by converting to the recommended format for each platform.</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Attachments</h3>
                <p className="text-gray-700 dark:text-gray-300">Convert images to smaller file sizes for email attachments, ensuring faster delivery and better compatibility.</p>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What image formats can I convert?</h3>
                <p className="text-gray-700 dark:text-gray-300">You can convert images to and from JPEG, PNG, and WEBP formats. The tool supports all common image formats as input, including JPEG, PNG, WEBP, GIF, BMP, and more.</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Will converting images reduce quality?</h3>
                <p className="text-gray-700 dark:text-gray-300">Quality depends on the format and settings. PNG uses lossless compression, so quality is preserved. JPEG and WEBP use lossy compression, but you can control the quality level from 10% to 100% to balance file size and quality.</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I convert multiple images at once?</h3>
                <p className="text-gray-700 dark:text-gray-300">Yes! You can upload and convert multiple images simultaneously. All images will be converted to your selected format, and you can download them individually or as a ZIP file.</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Is my data secure?</h3>
                <p className="text-gray-700 dark:text-gray-300">Absolutely! All image processing happens entirely in your browser. Your images are never uploaded to any server, ensuring complete privacy and security. No data is stored or transmitted.</p>
              </div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What's the difference between JPEG, PNG, and WEBP?</h3>
                <p className="text-gray-700 dark:text-gray-300">JPEG is best for photos with many colors. PNG supports transparency and is lossless, ideal for graphics. WEBP offers excellent compression with good quality, perfect for web use. Choose based on your needs.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Are there any file size limits?</h3>
                <p className="text-gray-700 dark:text-gray-300">There are no strict file size limits, but very large images may take longer to process depending on your device's capabilities. The tool works best with images under 50MB per file.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
