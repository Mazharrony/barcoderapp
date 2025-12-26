'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarcodeConfig, BarcodeType } from '@/lib/types';
import { generateBarcode, validateBarcodeValue } from '@/lib/barcode-generator';
import { exportBarcode } from '@/lib/export-utils';
import BarcodeControls from './BarcodeControls';
import BarcodePreview from './BarcodePreview';
import BatchGenerator from './BatchGenerator';
import AboutSection from './AboutSection';

const BARCODE_TYPES: { value: BarcodeType; label: string }[] = [
  { value: 'code128', label: 'Code 128' },
  { value: 'code39', label: 'Code 39' },
  { value: 'ean13', label: 'EAN-13' },
  { value: 'ean8', label: 'EAN-8' },
  { value: 'upc', label: 'UPC-A' },
  { value: 'itf14', label: 'ITF-14' },
  { value: 'msi', label: 'MSI' },
  { value: 'pharmacode', label: 'Pharmacode' },
  { value: 'codabar', label: 'Codabar' },
];

export default function BarcodeGenerator() {
  const [config, setConfig] = useState<BarcodeConfig>({
    type: 'code128',
    value: '123456789012',
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
        setError(`Invalid value for ${config.type}. Please check the format.`);
        return;
      }

      setIsGenerating(true);
      setError('');

      try {
        const dataUrl = await generateBarcode(config);
        setBarcodeDataUrl(dataUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate barcode');
        setBarcodeDataUrl('');
      } finally {
        setIsGenerating(false);
      }
    };

    generate();
  }, [config]);

  // Handle hash navigation on page load
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            const navHeight = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 300);
      }
    };

    // Handle initial hash
    handleHashScroll();
    
    // Handle hash change (when navigating within the same page)
    window.addEventListener('hashchange', handleHashScroll);
    
    return () => {
      window.removeEventListener('hashchange', handleHashScroll);
    };
  }, []);


  const handleConfigChange = (updates: Partial<BarcodeConfig>) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      
      // Initialize QR config if switching to QR code
      if (updates.type === 'qrcode' && !newConfig.qrConfig) {
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
  };

  const handleExport = async () => {
    if (!barcodeDataUrl) return;

    const filename = `barcode-${config.type}-${Date.now()}`;
    try {
      await exportBarcode(barcodeDataUrl, config, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export barcode');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <section id="generator" className="mb-16 text-center animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fast & Free Barcode Generator
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
              Create Professional<br />Barcodes Instantly
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6 leading-relaxed">
              Generate high-quality barcodes (Code 128, Code 39, EAN-13, UPC-A, and more) in seconds. Export as PNG, JPEG, SVG, or PDF. 
              No registration required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% Free
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No Account Required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Works Offline
              </div>
            </div>
          </div>
        </section>

        {/* Generator Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Controls Panel */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8 hover:shadow-3xl hover:scale-[1.01] transition-all duration-300">
            <BarcodeControls
              config={config}
              barcodeTypes={BARCODE_TYPES}
              onChange={handleConfigChange}
              onExport={handleExport}
              isGenerating={isGenerating}
              hasBarcode={!!barcodeDataUrl}
              error={error}
            />
          </div>

          {/* Preview Panel */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60 p-8 hover:shadow-3xl hover:scale-[1.01] transition-all duration-300">
            <BarcodePreview
              dataUrl={barcodeDataUrl}
              isGenerating={isGenerating}
              error={error}
            />
          </div>
        </div>

        {/* Batch Generator */}
        <section id="batch" className="mb-16">
          <BatchGenerator
            config={{
              type: config.type,
              width: config.width,
              height: config.height,
              displayValue: config.displayValue,
              fontSize: config.fontSize,
              fontColor: config.fontColor,
              backgroundColor: config.backgroundColor,
              lineColor: config.lineColor,
              margin: config.margin,
              format: config.format,
            }}
          />
        </section>

        {/* About Section */}
        <AboutSection />
      </div>
    </div>
  );
}

