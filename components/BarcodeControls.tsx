'use client';

import { BarcodeConfig, BarcodeType, ExportFormat } from '@/lib/types';

interface BarcodeControlsProps {
  config: BarcodeConfig;
  barcodeTypes?: { value: BarcodeType; label: string }[];
  onChange: (updates: Partial<BarcodeConfig>) => void;
  onExport: () => void;
  isGenerating: boolean;
  hasBarcode: boolean;
  error: string;
}

export default function BarcodeControls({
  config,
  barcodeTypes,
  onChange,
  onExport,
  hasBarcode,
  error,
}: BarcodeControlsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuration
        </h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg text-red-700 dark:text-red-400 text-sm flex items-start gap-3 animate-shake">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Barcode Type */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Barcode Type
        </label>
        <div className="relative">
          <select
            value={config.type}
            onChange={(e) => onChange({ type: e.target.value as BarcodeType })}
            className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            {barcodeTypes && barcodeTypes.length > 0 ? (
              barcodeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))
            ) : (
              <option value={config.type}>{config.type}</option>
            )}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Value Input */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          Barcode Value
        </label>
        <input
          type="text"
          value={config.value}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder="Enter barcode value"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {config.type === 'qrcode' 
            ? 'Can contain any text or URL' 
            : 'Numeric values required for most formats'}
        </p>
      </div>

      {/* Dimensions */}
      {config.type === 'qrcode' ? (
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            QR Code Size
          </label>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Size (px)</label>
            <input
              type="number"
              min="200"
              max="1000"
              step="50"
              value={config.qrConfig?.qrSize || 400}
              onChange={(e) => onChange({
                qrConfig: {
                  ...config.qrConfig,
                  qrSize: parseInt(e.target.value) || 400,
                  errorCorrectionLevel: config.qrConfig?.errorCorrectionLevel || 'M',
                  dotType: config.qrConfig?.dotType || 'square',
                  quietZone: config.qrConfig?.quietZone ?? 4,
                }
              })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Recommended: 400-600px for best quality
            </p>
          </div>
        </div>
      ) : (
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            Dimensions
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Width</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={config.width}
                onChange={(e) => onChange({ width: parseFloat(e.target.value) || 2 })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Height (px)</label>
              <input
                type="number"
                min="50"
                max="300"
                step="10"
                value={config.height}
                onChange={(e) => onChange({ height: parseInt(e.target.value) || 100 })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* QR Code Specific Options */}
      {config.type === 'qrcode' && (
        <>
          {/* Error Correction Level */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Error Correction Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => onChange({
                    qrConfig: {
                      ...config.qrConfig,
                      errorCorrectionLevel: level,
                      qrSize: config.qrConfig?.qrSize || 400,
                      dotType: config.qrConfig?.dotType || 'square',
                      quietZone: config.qrConfig?.quietZone ?? 4,
                      logoUrl: config.qrConfig?.logoUrl,
                      logoSize: config.qrConfig?.logoSize || 15,
                    }
                  })}
                  className={`px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    config.qrConfig?.errorCorrectionLevel === level
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-102'
                  }`}
                  title={
                    level === 'L' ? 'Low (~7% damage recovery)' :
                    level === 'M' ? 'Medium (~15% damage recovery)' :
                    level === 'Q' ? 'Quartile (~25% damage recovery)' :
                    'High (~30% damage recovery)'
                  }
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {config.qrConfig?.errorCorrectionLevel === 'L' && 'Low: ~7% damage recovery - Smallest size'}
              {config.qrConfig?.errorCorrectionLevel === 'M' && 'Medium: ~15% damage recovery - Recommended'}
              {config.qrConfig?.errorCorrectionLevel === 'Q' && 'Quartile: ~25% damage recovery - Good balance'}
              {config.qrConfig?.errorCorrectionLevel === 'H' && 'High: ~30% damage recovery - Maximum reliability'}
            </p>
          </div>

          {/* Dot Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Dot Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['square', 'rounded', 'dots'] as const).map((dotType) => (
                <button
                  key={dotType}
                  onClick={() => onChange({
                    qrConfig: {
                      ...config.qrConfig,
                      dotType: dotType,
                      errorCorrectionLevel: config.qrConfig?.errorCorrectionLevel || 'M',
                      qrSize: config.qrConfig?.qrSize || 400,
                      quietZone: config.qrConfig?.quietZone ?? 4,
                      logoUrl: config.qrConfig?.logoUrl,
                      logoSize: config.qrConfig?.logoSize || 15,
                    }
                  })}
                  className={`px-3 py-2.5 rounded-xl font-semibold text-sm transition-all capitalize ${
                    config.qrConfig?.dotType === dotType
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-102'
                  }`}
                >
                  {dotType}
                </button>
              ))}
            </div>
          </div>

          {/* Quiet Zone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
              Quiet Zone (Margin)
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="1"
              value={config.qrConfig?.quietZone ?? 4}
              onChange={(e) => onChange({
                qrConfig: {
                  ...config.qrConfig,
                  quietZone: parseInt(e.target.value) || 4,
                  errorCorrectionLevel: config.qrConfig?.errorCorrectionLevel || 'M',
                  qrSize: config.qrConfig?.qrSize || 400,
                  dotType: config.qrConfig?.dotType || 'square',
                  logoUrl: config.qrConfig?.logoUrl,
                  logoSize: config.qrConfig?.logoSize || 15,
                }
              })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              Recommended: 4 modules (standard QR code margin)
            </p>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Logo (Optional)
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const logoDataUrl = event.target?.result as string;
                        onChange({
                          qrConfig: {
                            ...config.qrConfig,
                            logoUrl: logoDataUrl,
                            errorCorrectionLevel: config.qrConfig?.errorCorrectionLevel || 'H', // Recommend H for logo
                            qrSize: config.qrConfig?.qrSize || 400,
                            dotType: config.qrConfig?.dotType || 'square',
                            quietZone: config.qrConfig?.quietZone ?? 4,
                            logoSize: config.qrConfig?.logoSize || 15,
                          }
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="flex-1 px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all cursor-pointer text-center text-sm font-medium"
                >
                  {config.qrConfig?.logoUrl ? 'Change Logo' : 'Upload Logo'}
                </label>
                {config.qrConfig?.logoUrl && (
                  <button
                    onClick={() => onChange({
                      qrConfig: {
                        ...config.qrConfig,
                        logoUrl: undefined,
                        errorCorrectionLevel: config.qrConfig?.errorCorrectionLevel || 'M',
                        qrSize: config.qrConfig?.qrSize || 400,
                        dotType: config.qrConfig?.dotType || 'square',
                        quietZone: config.qrConfig?.quietZone ?? 4,
                        logoSize: config.qrConfig?.logoSize || 15,
                      }
                    })}
                    className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove logo"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {config.qrConfig?.logoUrl && (
                <>
                  <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={config.qrConfig.logoUrl}
                      alt="Logo preview"
                      className="max-w-20 max-h-20 object-contain rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                      Logo Size: {config.qrConfig?.logoSize || 15}% of QR code
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="25"
                      step="1"
                      value={config.qrConfig?.logoSize || 15}
                      onChange={(e) => onChange({
                        qrConfig: {
                          ...config.qrConfig,
                          logoSize: parseInt(e.target.value) || 15,
                          errorCorrectionLevel: config.qrConfig?.errorCorrectionLevel || 'H',
                          qrSize: config.qrConfig?.qrSize || 400,
                          dotType: config.qrConfig?.dotType || 'square',
                          quietZone: config.qrConfig?.quietZone ?? 4,
                          logoUrl: config.qrConfig?.logoUrl,
                        }
                      })}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                      <span>10%</span>
                      <span>25%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>
                        <strong>Tip:</strong> Using error correction level &quot;H&quot; (High) is recommended when adding a logo to ensure the QR code remains scannable.
                      </span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Colors */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Colors
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Bar Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.fontColor}
                onChange={(e) => onChange({ fontColor: e.target.value })}
                className="w-14 h-11 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:scale-105 transition-transform"
              />
              <input
                type="text"
                value={config.fontColor}
                onChange={(e) => onChange({ fontColor: e.target.value })}
                className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Background</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="w-14 h-11 border-2 border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:scale-105 transition-transform"
              />
              <input
                type="text"
                value={config.backgroundColor}
                onChange={(e) => onChange({ backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Text Options */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <div className="relative">
            <input
              type="checkbox"
              checked={config.displayValue}
              onChange={(e) => onChange({ displayValue: e.target.checked })}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Display Value Text
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Show the encoded value below the barcode
            </p>
          </div>
        </label>
      </div>

      {config.displayValue && (
        <div className="ml-8 pl-4 border-l-2 border-blue-200 dark:border-blue-800">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Font Size</label>
          <input
            type="number"
            min="10"
            max="40"
            value={config.fontSize}
            onChange={(e) => onChange({ fontSize: parseInt(e.target.value) || 20 })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      )}

      {/* Margin - Only for non-QR codes */}
      {config.type !== 'qrcode' && (
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
            Margin (px)
          </label>
          <input
            type="number"
            min="0"
            max="50"
            step="1"
            value={config.margin}
            onChange={(e) => onChange({ margin: parseInt(e.target.value) || 10 })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      )}

      {/* Export Format */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Format
        </label>
        <div className="grid grid-cols-4 gap-2">
          {(['png', 'jpeg', 'svg', 'pdf'] as ExportFormat[]).map((format) => (
            <button
              key={format}
              onClick={() => onChange({ format })}
              className={`px-3 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                config.format === format
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-102'
              }`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={onExport}
        disabled={!hasBarcode}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export {config.format.toUpperCase()}
      </button>
    </div>
  );
}

