'use client';

interface BarcodePreviewProps {
  dataUrl: string;
  isGenerating: boolean;
  error: string;
}

export default function BarcodePreview({
  dataUrl,
  isGenerating,
  error,
}: BarcodePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Live Preview
        </h2>
      </div>

      <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {isGenerating ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Generating barcode...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400">
            <svg
              className="mx-auto h-12 w-12 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p>{error}</p>
          </div>
        ) : dataUrl ? (
          <div className="w-full flex flex-col items-center relative z-10 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUrl}
                alt="Barcode preview"
                className="max-w-full h-auto rounded-lg"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
            <button
              onClick={() => {
                if (dataUrl) {
                  const link = document.createElement('a');
                  link.href = dataUrl;
                  link.download = `barcode-${Date.now()}.png`;
                  link.click();
                }
              }}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Preview
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-400 dark:text-gray-500 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200/50 dark:bg-gray-700/50 rounded-full mb-4">
              <svg
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-base font-medium">Enter a value to generate barcode</p>
            <p className="text-sm mt-2 text-gray-400 dark:text-gray-600">Your barcode will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

