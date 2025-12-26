'use client';

import { useState, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  compressImage,
  convertImageFormat,
  resizeImage,
  cropImage,
  imageToPDF,
  socialMediaPresets,
} from '@/lib/image-utils';

type ToolType = 'compressor' | 'converter' | 'resizer' | 'cropper' | 'to-pdf' | 'from-pdf' | 'heic' | 'bg-remover';

interface ProcessedFile {
  id: string;
  originalName: string;
  file: File;
  processedBlob?: Blob;
  processedDataUrl?: string;
  originalSize?: number;
  processedSize?: number;
  error?: string;
  cropData?: { x: number; y: number; width: number; height: number };
}

export default function ImageTools() {
  const [activeTool, setActiveTool] = useState<ToolType>('compressor');
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Compressor settings
  const [compressionQuality, setCompressionQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState<number | undefined>();
  const [maxHeight, setMaxHeight] = useState<number | undefined>();
  
  // Converter settings
  const [targetFormat, setTargetFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [converterQuality, setConverterQuality] = useState(90);
  const [converterBgColor, setConverterBgColor] = useState('#FFFFFF');
  
  // Resizer settings
  const [resizeWidth, setResizeWidth] = useState<number | undefined>();
  const [resizeHeight, setResizeHeight] = useState<number | undefined>();
  const [resizePercent, setResizePercent] = useState<number | undefined>();
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  
  // Cropper settings
  const [cropImageData, setCropImageData] = useState<{ url: string; width: number; height: number } | null>(null);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropEnd, setCropEnd] = useState<{ x: number; y: number } | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  
  // PDF settings
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cropCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, accept: string = 'image/*') => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: ProcessedFile[] = selectedFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      originalName: file.name,
      file,
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Image Compressor
  const handleCompress = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    const processed: ProcessedFile[] = [];
    for (const fileItem of files) {
      try {
        const result = await compressImage(fileItem.file, compressionQuality / 100, maxWidth, maxHeight);
        processed.push({
          ...fileItem,
          processedBlob: result.blob,
          processedDataUrl: result.dataUrl,
          originalSize: result.originalSize,
          processedSize: result.compressedSize,
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

  // Format Converter
  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    const processed: ProcessedFile[] = [];
    for (const fileItem of files) {
      try {
        const result = await convertImageFormat(
          fileItem.file,
          targetFormat,
          converterQuality / 100,
          targetFormat === 'jpeg' ? converterBgColor : undefined
        );
        processed.push({
          ...fileItem,
          processedBlob: result.blob,
          processedDataUrl: result.dataUrl,
        });
      } catch (error) {
        processed.push({
          ...fileItem,
          error: error instanceof Error ? error.message : 'Conversion failed',
        });
      }
    }
    
    setFiles(processed);
    setIsProcessing(false);
  };

  // Image Resizer
  const handleResize = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    let width = resizeWidth;
    let height = resizeHeight;
    
    // Apply preset if selected
    if (selectedPreset && socialMediaPresets[selectedPreset as keyof typeof socialMediaPresets]) {
      const preset = socialMediaPresets[selectedPreset as keyof typeof socialMediaPresets];
      width = preset.width;
      height = preset.height;
    }
    
    // Apply percentage if set
    if (resizePercent) {
      // Will be calculated per image
    }
    
    const processed: ProcessedFile[] = [];
    for (const fileItem of files) {
      try {
        let finalWidth = width;
        let finalHeight = height;
        
        if (resizePercent) {
          const img = new Image();
          const imgUrl = URL.createObjectURL(fileItem.file);
          await new Promise((resolve) => {
            img.onload = () => {
              finalWidth = (img.width * resizePercent) / 100;
              finalHeight = (img.height * resizePercent) / 100;
              URL.revokeObjectURL(imgUrl);
              resolve(null);
            };
            img.src = imgUrl;
          });
        }
        
        const result = await resizeImage(fileItem.file, finalWidth, finalHeight, maintainAspectRatio);
        processed.push({
          ...fileItem,
          processedBlob: result.blob,
          processedDataUrl: result.dataUrl,
        });
      } catch (error) {
        processed.push({
          ...fileItem,
          error: error instanceof Error ? error.message : 'Resize failed',
        });
      }
    }
    
    setFiles(processed);
    setIsProcessing(false);
  };

  // Image Cropper
  const handleCropStart = (file: ProcessedFile) => {
    const img = new Image();
    const url = URL.createObjectURL(file.file);
    img.onload = () => {
      setCropImageData({ url, width: img.width, height: img.height });
      setFiles([file]);
      setIsCropping(true);
    };
    img.src = url;
  };

  const handleCropMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!cropImageData) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = cropImageData.width / rect.width;
    const scaleY = cropImageData.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setCropStart({ x, y });
    setCropEnd({ x, y });
  };

  const handleCropMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!cropStart || !cropImageData) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = cropImageData.width / rect.width;
    const scaleY = cropImageData.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    setCropEnd({ x, y });
  };

  const handleCropMouseUp = () => {
    // Crop selection complete
  };

  const handleCropComplete = async () => {
    if (!cropStart || !cropEnd || files.length === 0 || !cropImageData) return;
    
    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);
    
    if (width < 10 || height < 10) {
      alert('Crop area too small. Please select a larger area.');
      return;
    }
    
    setIsProcessing(true);
    try {
      const result = await cropImage(files[0].file, x, y, width, height);
      setFiles([{
        ...files[0],
        processedBlob: result.blob,
        processedDataUrl: result.dataUrl,
        cropData: { x, y, width, height },
      }]);
      setIsCropping(false);
      setCropImageData(null);
      setCropStart(null);
      setCropEnd(null);
    } catch (error) {
      setFiles([{ ...files[0], error: 'Crop failed' }]);
    }
    setIsProcessing(false);
  };

  // Image to PDF
  const handleImageToPDF = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    
    try {
      const imageFiles = files.map(f => f.file);
      const pdfBlob = await imageToPDF(imageFiles[0], imageFiles);
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `images-${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF creation failed:', error);
    }
    
    setIsProcessing(false);
  };

  // Download handlers
  const handleDownload = (fileItem: ProcessedFile) => {
    if (!fileItem.processedBlob) return;
    
    const url = URL.createObjectURL(fileItem.processedBlob);
    const link = document.createElement('a');
    link.href = url;
    
    let extension = '';
    if (activeTool === 'converter') {
      extension = targetFormat === 'jpeg' ? '.jpg' : targetFormat === 'png' ? '.png' : '.webp';
    } else {
      extension = fileItem.originalName.match(/\.[^.]+$/)?.[0] || '.jpg';
    }
    
    link.download = fileItem.originalName.replace(/\.[^.]+$/, '') + extension;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    const processedFiles = files.filter(f => f.processedBlob);
    if (processedFiles.length === 0) return;
    
    if (processedFiles.length === 1) {
      handleDownload(processedFiles[0]);
      return;
    }
    
    const zip = new JSZip();
    for (const fileItem of processedFiles) {
      if (fileItem.processedBlob) {
        const extension = activeTool === 'converter' 
          ? (targetFormat === 'jpeg' ? '.jpg' : targetFormat === 'png' ? '.png' : '.webp')
          : fileItem.originalName.match(/\.[^.]+$/)?.[0] || '.jpg';
        const fileName = fileItem.originalName.replace(/\.[^.]+$/, '') + extension;
        zip.file(fileName, fileItem.processedBlob);
      }
    }
    
    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `processed-images-${Date.now()}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('ZIP creation failed:', error);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const clearAll = () => {
    setFiles([]);
    setCropImageData(null);
    setCropStart(null);
    setCropEnd(null);
    setIsCropping(false);
  };

  const tools: { id: ToolType; name: string; icon: string }[] = [
    { id: 'compressor', name: 'Compressor', icon: '📦' },
    { id: 'converter', name: 'Converter', icon: '🔄' },
    { id: 'resizer', name: 'Resizer', icon: '📏' },
    { id: 'cropper', name: 'Cropper', icon: '✂️' },
    { id: 'to-pdf', name: 'Image to PDF', icon: '📄' },
    { id: 'from-pdf', name: 'PDF to Image', icon: '🖼️' },
    { id: 'heic', name: 'HEIC to JPG', icon: '📱' },
    { id: 'bg-remover', name: 'BG Remover', icon: '🎨' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-12 text-center animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              All-in-One Image Tools
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
              Professional Image<br />Processing Tools
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
              Compress, convert, resize, crop, remove backgrounds, and more. All tools in one place, completely free.
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
                Select Images
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept={activeTool === 'heic' ? 'image/heic,image/heif' : activeTool === 'from-pdf' ? 'application/pdf' : 'image/*'}
                multiple={activeTool !== 'cropper'}
                onChange={(e) => handleFileSelect(e)}
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
            {activeTool === 'compressor' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Quality: {compressionQuality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={compressionQuality}
                    onChange={(e) => setCompressionQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Max Width (px)</label>
                    <input
                      type="number"
                      value={maxWidth || ''}
                      onChange={(e) => setMaxWidth(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Auto"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Max Height (px)</label>
                    <input
                      type="number"
                      value={maxHeight || ''}
                      onChange={(e) => setMaxHeight(e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Auto"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={handleCompress}
                  disabled={files.length === 0 || isProcessing}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {isProcessing ? 'Compressing...' : 'Compress Images'}
                </button>
              </>
            )}

            {activeTool === 'converter' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Convert To
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['jpeg', 'png', 'webp'] as const).map((format) => (
                      <button
                        key={format}
                        onClick={() => setTargetFormat(format)}
                        className={`px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
                          targetFormat === format
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                {targetFormat === 'jpeg' && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Background Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={converterBgColor}
                        onChange={(e) => setConverterBgColor(e.target.value)}
                        className="w-14 h-11 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer"
                      />
                      <input
                        type="text"
                        value={converterBgColor}
                        onChange={(e) => setConverterBgColor(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                )}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Quality: {converterQuality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={converterQuality}
                    onChange={(e) => setConverterQuality(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <button
                  onClick={handleConvert}
                  disabled={files.length === 0 || isProcessing}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {isProcessing ? 'Converting...' : 'Convert Images'}
                </button>
              </>
            )}

            {activeTool === 'resizer' && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Social Media Presets
                  </label>
                  <select
                    value={selectedPreset}
                    onChange={(e) => {
                      setSelectedPreset(e.target.value);
                      if (e.target.value) {
                        const preset = socialMediaPresets[e.target.value as keyof typeof socialMediaPresets];
                        setResizeWidth(preset.width);
                        setResizeHeight(preset.height);
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Custom Size</option>
                    {Object.entries(socialMediaPresets).map(([key, preset]) => (
                      <option key={key} value={key}>{preset.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Resize by Percentage
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={resizePercent || ''}
                    onChange={(e) => {
                      const val = e.target.value ? parseInt(e.target.value) : undefined;
                      setResizePercent(val);
                      if (val) {
                        setResizeWidth(undefined);
                        setResizeHeight(undefined);
                        setSelectedPreset('');
                      }
                    }}
                    placeholder="e.g., 50 for 50%"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Width (px)</label>
                    <input
                      type="number"
                      value={resizeWidth || ''}
                      onChange={(e) => {
                        setResizeWidth(e.target.value ? parseInt(e.target.value) : undefined);
                        setResizePercent(undefined);
                        setSelectedPreset('');
                      }}
                      placeholder="Auto"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Height (px)</label>
                    <input
                      type="number"
                      value={resizeHeight || ''}
                      onChange={(e) => {
                        setResizeHeight(e.target.value ? parseInt(e.target.value) : undefined);
                        setResizePercent(undefined);
                        setSelectedPreset('');
                      }}
                      placeholder="Auto"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Maintain Aspect Ratio</span>
                  </label>
                </div>
                <button
                  onClick={handleResize}
                  disabled={files.length === 0 || isProcessing}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {isProcessing ? 'Resizing...' : 'Resize Images'}
                </button>
              </>
            )}

            {activeTool === 'cropper' && (
              <>
                {!isCropping && files.length > 0 && (
                  <button
                    onClick={() => handleCropStart(files[0])}
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg mb-4"
                  >
                    Start Cropping
                  </button>
                )}
                {isCropping && (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Click and drag on the image to select crop area
                    </p>
                    <button
                      onClick={handleCropComplete}
                      disabled={!cropStart || !cropEnd || isProcessing}
                      className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                      {isProcessing ? 'Cropping...' : 'Apply Crop'}
                    </button>
                    <button
                      onClick={() => {
                        setIsCropping(false);
                        setCropImageData(null);
                        setCropStart(null);
                        setCropEnd(null);
                      }}
                      className="w-full mt-2 py-2 px-4 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </>
            )}

            {activeTool === 'to-pdf' && (
              <button
                onClick={handleImageToPDF}
                disabled={files.length === 0 || isProcessing}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isProcessing ? 'Creating PDF...' : 'Convert to PDF'}
              </button>
            )}

            {activeTool === 'from-pdf' && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  PDF to Image conversion requires PDF.js library. Please install <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">pdf.js-dist</code> package.
                </p>
              </div>
            )}

            {activeTool === 'heic' && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  HEIC conversion requires <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">heic2any</code> library. Please install the package.
                </p>
              </div>
            )}

            {activeTool === 'bg-remover' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                  <strong>AI Background Remover</strong> requires an API service. Options:
                </p>
                <ul className="text-xs text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                  <li>Remove.bg API</li>
                  <li>Clipdrop API</li>
                  <li>Custom AI service</li>
                </ul>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  UI is ready - just integrate your preferred API.
                </p>
              </div>
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

          {/* Preview/Results Panel */}
          <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              {isCropping ? 'Crop Image' : `Files (${files.length})`}
            </h2>

            {isCropping && cropImageData ? (
              <div className="relative">
                <div className="relative border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cropImageData.url}
                    alt="Crop preview"
                    className="max-w-full h-auto cursor-crosshair"
                    onMouseDown={handleCropMouseDown}
                    onMouseMove={handleCropMouseMove}
                    onMouseUp={handleCropMouseUp}
                    onMouseLeave={() => {
                      if (!cropStart) return;
                      // Keep selection on mouse leave
                    }}
                  />
                  {cropStart && cropEnd && cropImageData && (
                    <div
                      className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
                      style={{
                        left: `${(Math.min(cropStart.x, cropEnd.x) / cropImageData.width) * 100}%`,
                        top: `${(Math.min(cropStart.y, cropEnd.y) / cropImageData.height) * 100}%`,
                        width: `${(Math.abs(cropEnd.x - cropStart.x) / cropImageData.width) * 100}%`,
                        height: `${(Math.abs(cropEnd.y - cropStart.y) / cropImageData.height) * 100}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">No files selected</p>
                <p className="text-sm mt-2">Upload images to get started</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">
                  {files.map((fileItem) => (
                    <div
                      key={fileItem.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex-shrink-0">
                        {fileItem.processedDataUrl ? (
                          <img
                            src={fileItem.processedDataUrl}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {fileItem.originalName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {fileItem.originalSize && fileItem.processedSize ? (
                            <>
                              {(fileItem.originalSize / 1024).toFixed(2)} KB → {(fileItem.processedSize / 1024).toFixed(2)} KB
                              {' '}
                              ({((1 - fileItem.processedSize / fileItem.originalSize) * 100).toFixed(1)}% reduction)
                            </>
                          ) : (
                            `${(fileItem.file.size / 1024).toFixed(2)} KB`
                          )}
                        </p>
                        {fileItem.error && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{fileItem.error}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {fileItem.processedBlob ? (
                          <button
                            onClick={() => handleDownload(fileItem)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            Download
                          </button>
                        ) : (
                          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {isProcessing ? 'Processing...' : 'Ready'}
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(fileItem.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {files.some(f => f.processedBlob) && (
                  <button
                    onClick={handleDownloadAll}
                    className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download All as ZIP
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <section id="services">
          <Footer />
        </section>
      </div>
    </div>
  );
}

