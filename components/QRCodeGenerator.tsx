'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarcodeConfig, BarcodeType } from '@/lib/types';
import { generateBarcode, validateBarcodeValue } from '@/lib/barcode-generator';
import { exportBarcode } from '@/lib/export-utils';
import QRCodeControls from './QRCodeControls';
import BarcodePreview from './BarcodePreview';
import BatchGenerator from './BatchGenerator';
import Link from 'next/link';
import { routes } from '@/lib/routes';

export default function QRCodeGenerator() {
  const [config, setConfig] = useState<BarcodeConfig>({
    type: 'qrcode',
    value: 'https://example.com',
    width: 2,
    height: 100,
    displayValue: true,
    fontSize: 20,
    fontColor: '#000000',
    backgroundColor: '#FFFFFF',
    lineColor: '#000000',
    margin: 10,
    format: 'png',
    qrConfig: {
      errorCorrectionLevel: 'M',
      qrSize: 400,
      dotType: 'square',
      quietZone: 4,
      logoSize: 15,
    },
  });

  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const generate = async () => {
      if (!config.value.trim()) {
        setError('Please enter a value');
        return;
      }

      if (!validateBarcodeValue(config.type, config.value)) {
        setError(`Invalid value for QR code. Please check the format.`);
        return;
      }

      setIsGenerating(true);
      setError('');

      try {
        const dataUrl = await generateBarcode(config);
        setBarcodeDataUrl(dataUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate QR code');
        setBarcodeDataUrl('');
      } finally {
        setIsGenerating(false);
      }
    };

    generate();
  }, [config]);

  const handleConfigChange = useCallback((updates: Partial<BarcodeConfig>) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      // Ensure QR config is always present for QR codes
      if (newConfig.type === 'qrcode' && !newConfig.qrConfig) {
        newConfig.qrConfig = {
          errorCorrectionLevel: 'M',
          qrSize: 400,
          dotType: 'square',
          quietZone: 4,
          logoSize: 15,
        };
      }
      return newConfig;
    });
  }, []);

  const handleExport = useCallback(async (format: 'png' | 'jpeg' | 'svg' | 'pdf') => {
    if (!barcodeDataUrl) return;
    
    try {
      const exportConfig = { ...config, format };
      const filename = `qr-code-${Date.now()}`;
      await exportBarcode(barcodeDataUrl, exportConfig, filename);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Export failed');
    }
  }, [barcodeDataUrl, config]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-12 text-center animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              QR Code Generator
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
              Free QR Code<br />Generator
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
              Create custom QR codes instantly. Add logos, customize colors, choose styles, and download in multiple formats. Perfect for marketing, business cards, and more.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <QRCodeControls
              config={config}
              onChange={handleConfigChange}
              onExport={handleExport}
              isGenerating={isGenerating}
              hasBarcode={!!barcodeDataUrl}
              error={error}
            />
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <BarcodePreview
              dataUrl={barcodeDataUrl}
              isGenerating={isGenerating}
              error={error}
            />
          </div>
        </div>

        {/* Batch Generator */}
        <div className="mb-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
          <BatchGenerator config={config} />
        </div>

        {/* SEO Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Features */}
          <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Add custom logos to QR codes</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Customize colors and styles</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Multiple error correction levels</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Export in PNG, JPEG, SVG, PDF</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Batch QR code generation</span>
              </li>
            </ul>
          </section>

          {/* Use Cases */}
          <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Common Use Cases</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Marketing campaigns and promotions</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Business cards and contact sharing</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>WiFi network sharing</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Product packaging and labels</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>Event tickets and access codes</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Related Tools */}
        <section className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Related Tools</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href={routes.standalone.barcodeGenerator}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Barcode Generator
            </Link>
            <Link
              href={routes.categories.image}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              Image Tools
            </Link>
            <Link
              href={routes.categories.pdf}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
            >
              PDF Tools
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

