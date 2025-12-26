'use client';

import { useState, useRef, useCallback } from 'react';
import { cropImage } from '@/lib/image-utils';
import JSZip from 'jszip';

interface ProcessedFile {
  id: string;
  originalName: string;
  file: File;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  processedBlob?: Blob;
  processedDataUrl?: string;
  originalSize: number;
  processedSize?: number;
  error?: string;
  isDragging?: boolean;
  dragStart?: { x: number; y: number };
}

export default function ImageCropper() {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRefs = useRef<{ [key: string]: HTMLImageElement | null }>({});

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    selectedFiles.forEach(file => {
      const id = `${Date.now()}-${Math.random()}`;
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setFiles(prev => [...prev, {
            id,
            originalName: file.name,
            file,
            imageUrl: event.target?.result as string,
            imageWidth: img.width,
            imageHeight: img.height,
            cropX: 0,
            cropY: 0,
            cropWidth: img.width,
            cropHeight: img.height,
            originalSize: file.size,
          }]);
        };
        img.src = event.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCrop = async (fileItem: ProcessedFile) => {
    setIsProcessing(true);
    
    try {
      const result = await cropImage(
        fileItem.file,
        fileItem.cropX,
        fileItem.cropY,
        fileItem.cropWidth,
        fileItem.cropHeight
      );

      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, processedBlob: result.blob, processedDataUrl: result.dataUrl, processedSize: result.blob.size, error: undefined }
          : f
      ));
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, error: error instanceof Error ? error.message : 'Cropping failed' }
          : f
      ));
    }
    
    setIsProcessing(false);
  };

  const handleDownload = (fileItem: ProcessedFile) => {
    if (!fileItem.processedBlob) return;

    const originalName = fileItem.originalName.split('.')[0];
    const extension = fileItem.originalName.split('.').pop() || 'png';
    const newFileName = `${originalName}-cropped.${extension}`;

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
        const newFileName = `${originalName}-cropped.${extension}`;
        zip.file(newFileName, fileItem.processedBlob);
      }
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cropped-images-${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateCrop = (id: string, x: number, y: number, width: number, height: number) => {
    setFiles(prev => prev.map(f => 
      f.id === id 
        ? { ...f, cropX: x, cropY: y, cropWidth: width, cropHeight: height }
        : f
    ));
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
            Image Cropper - Free Online Tool
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
            Crop images with precision using our free online image cropper. Select any area of your image and crop it instantly. Perfect for removing unwanted areas, focusing on subjects, or creating custom image dimensions.
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
              Image Cropper
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

            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>How to crop:</strong> Use the input fields below each image to set crop coordinates and dimensions, then click "Crop Image".
              </p>
            </div>

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
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
                        Original: {fileItem.imageWidth} × {fileItem.imageHeight}px
                        {fileItem.processedSize && (
                          <span className="ml-2">→ Cropped: {formatFileSize(fileItem.processedSize)}</span>
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
                  ) : fileItem.imageUrl ? (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700">
                        <img
                          ref={(el) => imageRefs.current[fileItem.id] = el}
                          src={fileItem.imageUrl}
                          alt="Original"
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">X</label>
                          <input
                            type="number"
                            min="0"
                            max={fileItem.imageWidth}
                            value={fileItem.cropX}
                            onChange={(e) => updateCrop(fileItem.id, parseInt(e.target.value) || 0, fileItem.cropY, fileItem.cropWidth, fileItem.cropHeight)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Y</label>
                          <input
                            type="number"
                            min="0"
                            max={fileItem.imageHeight}
                            value={fileItem.cropY}
                            onChange={(e) => updateCrop(fileItem.id, fileItem.cropX, parseInt(e.target.value) || 0, fileItem.cropWidth, fileItem.cropHeight)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Width</label>
                          <input
                            type="number"
                            min="1"
                            max={fileItem.imageWidth}
                            value={fileItem.cropWidth}
                            onChange={(e) => updateCrop(fileItem.id, fileItem.cropX, fileItem.cropY, parseInt(e.target.value) || 1, fileItem.cropHeight)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Height</label>
                          <input
                            type="number"
                            min="1"
                            max={fileItem.imageHeight}
                            value={fileItem.cropHeight}
                            onChange={(e) => updateCrop(fileItem.id, fileItem.cropX, fileItem.cropY, fileItem.cropWidth, parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                          />
                        </div>
                      </div>

                      {!fileItem.processedDataUrl && (
                        <button
                          onClick={() => handleCrop(fileItem)}
                          disabled={isProcessing}
                          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                        >
                          {isProcessing ? 'Cropping...' : 'Crop Image'}
                        </button>
                      )}

                      {fileItem.processedDataUrl && (
                        <>
                          <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                              src={fileItem.processedDataUrl}
                              alt="Cropped"
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
                            Download Cropped
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8 text-center">
                      <p className="text-gray-600 dark:text-gray-400">Loading image...</p>
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

