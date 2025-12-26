'use client';

import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { BarcodeConfig, BarcodeType, QRErrorCorrectionLevel } from './types';

export async function generateBarcode(config: BarcodeConfig): Promise<string> {
  const { type, value } = config;

  if (type === 'qrcode') {
    return generateQRCode(value, config);
  }

  return generateLinearBarcode(config);
}

function generateLinearBarcode(config: BarcodeConfig): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create a canvas element that will be rendered off-screen
      const canvas = document.createElement('canvas');
      
      // Create a container to hold the canvas temporarily
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.style.width = '400px';
      container.style.height = `${config.height + 40}px`;
      container.appendChild(canvas);
      document.body.appendChild(container);
      
      try {
        const options: {
          format: string;
          width: number;
          height: number;
          displayValue: boolean;
          fontSize: number;
          font: string;
          textMargin: number;
          margin: number;
          background: string;
          lineColor: string;
          fontOptions: string;
        } = {
          format: config.type,
          width: config.width,
          height: config.height,
          displayValue: config.displayValue,
          fontSize: config.fontSize,
          font: 'Arial',
          textMargin: config.margin / 2,
          margin: config.margin,
          background: config.backgroundColor,
          lineColor: config.fontColor,
          fontOptions: 'bold',
        };

        JsBarcode(canvas, config.value, options);
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // Clean up
        document.body.removeChild(container);
        
        resolve(dataUrl);
      } catch (error) {
        // Clean up on error
        if (container.parentNode) {
          document.body.removeChild(container);
        }
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function generateQRCode(value: string, config: BarcodeConfig): Promise<string> {
  try {
    // Use QR-specific size if available, otherwise use height
    const qrSize = config.qrConfig?.qrSize || Math.max(config.height, 400);
    const errorCorrectionLevel = config.qrConfig?.errorCorrectionLevel || 'M';
    const quietZone = config.qrConfig?.quietZone ?? config.margin;
    
    // Generate base QR code
    const dataUrl = await QRCode.toDataURL(value, {
      width: qrSize,
      margin: quietZone,
      errorCorrectionLevel: errorCorrectionLevel,
      color: {
        dark: config.fontColor,
        light: config.backgroundColor,
      },
      type: 'image/png',
    });

    // Apply dot type styling if rounded or dots
    if (config.qrConfig?.dotType && config.qrConfig.dotType !== 'square') {
      return applyQRDotStyle(dataUrl, config.qrConfig.dotType, qrSize);
    }

    return dataUrl;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
}

function applyQRDotStyle(dataUrl: string, dotType: 'rounded' | 'dots', size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = size;
      canvas.height = size;
      
      // Draw background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      
      // Draw QR code with rounded corners or dots
      const imageData = ctx.createImageData(size, size);
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        reject(new Error('Could not get temp canvas context'));
        return;
      }
      
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      tempCtx.drawImage(img, 0, 0);
      const sourceData = tempCtx.getImageData(0, 0, img.width, img.height);
      
      const scale = size / img.width;
      const radius = dotType === 'rounded' ? 2 : 1;
      
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const sourceX = Math.floor(x / scale);
          const sourceY = Math.floor(y / scale);
          const sourceIndex = (sourceY * img.width + sourceX) * 4;
          
          const r = sourceData.data[sourceIndex];
          const g = sourceData.data[sourceIndex + 1];
          const b = sourceData.data[sourceIndex + 2];
          
          // If it's a dark pixel, draw with rounded style
          if (r < 128 || g < 128 || b < 128) {
            const pixelIndex = (y * size + x) * 4;
            imageData.data[pixelIndex] = 0;
            imageData.data[pixelIndex + 1] = 0;
            imageData.data[pixelIndex + 2] = 0;
            imageData.data[pixelIndex + 3] = 255;
          }
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      // Apply dots effect
      if (dotType === 'dots') {
        applyDotsEffect(ctx, size, sourceData, img.width, scale);
      }
      // For rounded, we'll use the original QR code (rounded corners require more complex processing)
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function applyRoundedCorners(ctx: CanvasRenderingContext2D, size: number): void {
  const imageData = ctx.getImageData(0, 0, size, size);
  const radius = 1.5;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      const alpha = imageData.data[index + 3];
      
      if (alpha > 0) {
        // Check surrounding pixels to create rounded effect
        let shouldRound = false;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
              const nIndex = (ny * size + nx) * 4;
              if (imageData.data[nIndex + 3] === 0) {
                shouldRound = true;
                break;
              }
            }
          }
          if (shouldRound) break;
        }
        
        if (shouldRound) {
          const distance = Math.sqrt(
            Math.pow(x % 1, 2) + Math.pow(y % 1, 2)
          );
          if (distance > radius) {
            imageData.data[index + 3] = 0;
          }
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

function applyDotsEffect(ctx: CanvasRenderingContext2D, size: number, sourceData: ImageData, sourceWidth: number, scale: number): void {
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);
  
  const dotSize = Math.max(1, Math.floor(scale * 0.8));
  const spacing = Math.max(1, Math.floor(scale));
  
  for (let y = 0; y < size; y += spacing) {
    for (let x = 0; x < size; x += spacing) {
      const sourceX = Math.floor(x / scale);
      const sourceY = Math.floor(y / scale);
      const sourceIndex = (sourceY * sourceWidth + sourceX) * 4;
      
      const r = sourceData.data[sourceIndex];
      const g = sourceData.data[sourceIndex + 1];
      const b = sourceData.data[sourceIndex + 2];
      
      if (r < 128 || g < 128 || b < 128) {
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(x + spacing / 2, y + spacing / 2, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

export function validateBarcodeValue(type: BarcodeType, value: string): boolean {
  if (!value || value.trim().length === 0) {
    return false;
  }

  const numericRegex = /^\d+$/;

  switch (type) {
    case 'ean13':
      return numericRegex.test(value) && (value.length === 12 || value.length === 13);
    case 'ean8':
      return numericRegex.test(value) && (value.length === 7 || value.length === 8);
    case 'upc':
      return numericRegex.test(value) && (value.length === 11 || value.length === 12);
    case 'itf14':
      return numericRegex.test(value) && value.length === 14;
    case 'code128':
    case 'code39':
    case 'qrcode':
      return true; // Accept any string
    default:
      return true;
  }
}

