'use client';

import { useState, useRef } from 'react';
import { resizeImage, socialMediaPresets } from '@/lib/image-utils';
import JSZip from 'jszip';

interface ProcessedFile {
  id: string;
  originalName: string;
  file: File;
  processedBlob?: Blob;
  processedDataUrl?: string;
  originalSize: number;
  processedSize?: number;
  newWidth?: number;
  newHeight?: number;
  error?: string;
}

export default function ImageResizer() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resizeMode, setResizeMode] = useState<'preset' | 'custom' | 'percent'>('custom');
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [percent, setPercent] = useState<string>('100');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
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

  const handleResize = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);

    const processedFiles = await Promise.all(
      files.map(async (fileItem) => {
        try {
          let targetWidth: number | undefined;
          let targetHeight: number | undefined;

          if (resizeMode === 'preset' && selectedPreset) {
            const preset = socialMediaPresets[selectedPreset as keyof typeof socialMediaPresets];
            if (preset) {
              targetWidth = preset.width;
              targetHeight = preset.height;
            }
          } else if (resizeMode === 'percent') {
            const percentValue = parseFloat(percent) / 100;
            // We'll need to get image dimensions first
            const img = new Image();
            const imgUrl = URL.createObjectURL(fileItem.file);
            await new Promise((resolve) => {
              img.onload = () => {
                targetWidth = Math.round(img.width * percentValue);
                targetHeight = Math.round(img.height * percentValue);
                URL.revokeObjectURL(imgUrl);
                resolve(null);
              };
              img.src = imgUrl;
            });
          } else {
            targetWidth = width ? parseInt(width) : undefined;
            targetHeight = height ? parseInt(height) : undefined;
          }

          const result = await resizeImage(
            fileItem.file,
            targetWidth,
            targetHeight,
            maintainAspectRatio
          );

          return {
            ...fileItem,
            processedBlob: result.blob,
            processedDataUrl: result.dataUrl,
            processedSize: result.blob.size,
            newWidth: result.newWidth,
            newHeight: result.newHeight,
            error: undefined,
          };
        } catch (error) {
          return {
            ...fileItem,
            error: error instanceof Error ? error.message : 'Resize failed',
          };
        }
      })
    );

    setFiles(processedFiles);
    setIsProcessing(false);
  };

  const handleDownload = (fileItem: ProcessedFile) => {
    if (!fileItem.processedBlob) return;

    const originalName = fileItem.originalName.split('.')[0];
    const extension = fileItem.originalName.split('.').pop() || 'png';
    const newFileName = `${originalName}-${fileItem.newWidth}x${fileItem.newHeight}.${extension}`;

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

    files.forEach((fileItem) => {
      if (fileItem.processedBlob) {
        const originalName = fileItem.originalName.split('.')[0];
        const extension = fileItem.originalName.split('.').pop() || 'png';
        const newFileName = `${originalName}-${fileItem.newWidth}x${fileItem.newHeight}.${extension}`;
        zip.file(newFileName, fileItem.processedBlob);
      }
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resized-images-${Date.now()}.zip`;
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
            Image Resizer - Free Online Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            Resize images to any dimensions instantly with our free online image resizer. Use social media presets or set custom dimensions. Maintain aspect ratio or resize freely. Perfect for social media, websites, and print.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              Image Resizer
            </h2>

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

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Resize Mode
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setResizeMode('preset')}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    resizeMode === 'preset'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Social Media Preset
                </button>
                <button
                  onClick={() => setResizeMode('custom')}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    resizeMode === 'custom'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Custom Dimensions
                </button>
                <button
                  onClick={() => setResizeMode('percent')}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    resizeMode === 'percent'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Percentage
                </button>
              </div>
            </div>

            {resizeMode === 'preset' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Select Preset
                </label>
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Choose a preset...</option>
                  {Object.entries(socialMediaPresets).map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.name} ({preset.width} × {preset.height})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {resizeMode === 'custom' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Dimensions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="Width"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Height"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {resizeMode === 'percent' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Percentage: {percent}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>10%</span>
                  <span>200%</span>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Maintain aspect ratio</span>
              </label>
            </div>

            <button
              onClick={handleResize}
              disabled={files.length === 0 || isProcessing || (resizeMode === 'preset' && !selectedPreset) || (resizeMode === 'custom' && !width && !height)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors mb-4"
            >
              {isProcessing ? 'Resizing...' : 'Resize Images'}
            </button>

            {hasResults && (
              <button
                onClick={handleDownloadAll}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors mb-4"
              >
                Download All ({processedCount})
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
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
                        {fileItem.newWidth && fileItem.newHeight ? (
                          <>Resized to: {fileItem.newWidth} × {fileItem.newHeight}px</>
                        ) : (
                          <>Original: {formatFileSize(fileItem.originalSize)}</>
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
                          alt="Resized"
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
                        Download Resized
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
                      <p className="text-gray-600 dark:text-gray-400">Ready to resize</p>
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

