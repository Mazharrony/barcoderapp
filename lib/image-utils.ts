'use client';

import jsPDF from 'jspdf';

// Image compression using canvas
export async function compressImage(
  file: File,
  quality: number = 0.9,
  maxWidth?: number,
  maxHeight?: number
): Promise<{ blob: Blob; dataUrl: string; originalSize: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Resize if needed
      if (maxWidth && width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (maxHeight && height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const originalSize = file.size;
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve({
              blob,
              dataUrl,
              originalSize,
              compressedSize: blob.size,
            });
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Convert image format
export async function convertImageFormat(
  file: File,
  targetFormat: 'jpeg' | 'png' | 'webp',
  quality: number = 0.9,
  backgroundColor?: string
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Fill background if provided
      if (backgroundColor && targetFormat === 'jpeg') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const mimeType = targetFormat === 'jpeg' ? 'image/jpeg' : targetFormat === 'png' ? 'image/png' : 'image/webp';
      const outputQuality = targetFormat === 'png' ? undefined : quality;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL(mimeType, outputQuality);
            resolve({ blob, dataUrl });
          } else {
            reject(new Error('Failed to convert image'));
          }
        },
        mimeType,
        outputQuality
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Resize image
export async function resizeImage(
  file: File,
  width?: number,
  height?: number,
  maintainAspectRatio: boolean = true
): Promise<{ blob: Blob; dataUrl: string; newWidth: number; newHeight: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let newWidth = width || img.width;
      let newHeight = height || img.height;

      if (maintainAspectRatio) {
        if (width && !height) {
          newHeight = (img.height * width) / img.width;
        } else if (height && !width) {
          newWidth = (img.width * height) / img.height;
        } else if (width && height) {
          const aspectRatio = img.width / img.height;
          const targetAspectRatio = width / height;
          if (aspectRatio > targetAspectRatio) {
            newHeight = width / aspectRatio;
          } else {
            newWidth = height * aspectRatio;
          }
        }
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL('image/png');
            resolve({ blob, dataUrl, newWidth, newHeight });
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        'image/png'
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Crop image
export async function cropImage(
  file: File,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL('image/png');
            resolve({ blob, dataUrl });
          } else {
            reject(new Error('Failed to crop image'));
          }
        },
        'image/png'
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Convert image to PDF
export async function imageToPDF(
  file: File,
  images?: File[]
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
    });

    const processImage = (imgFile: File, index: number, total: number): Promise<void> => {
      return new Promise((imgResolve, imgReject) => {
        const img = new Image();
        img.onload = () => {
          if (index > 0) {
            pdf.addPage();
          }

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          let imgWidth = img.width;
          let imgHeight = img.height;
          
          // Scale to fit page
          const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight, 1);
          imgWidth *= scale;
          imgHeight *= scale;
          
          const x = (pdfWidth - imgWidth) / 2;
          const y = (pdfHeight - imgHeight) / 2;

          pdf.addImage(img.src, 'PNG', x, y, imgWidth, imgHeight);
          
          if (index === total - 1) {
            const pdfBlob = pdf.output('blob');
            resolve(pdfBlob);
          }
          imgResolve();
        };
        img.onerror = () => imgReject(new Error('Failed to load image'));
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(imgFile);
      });
    };

    const filesToProcess = images && images.length > 0 ? images : [file];
    
    Promise.all(filesToProcess.map((f, i) => processImage(f, i, filesToProcess.length)))
      .catch(reject);
  });
}

// PDF to Image (extract first page as image)
export async function pdfToImage(file: File): Promise<{ blob: Blob; dataUrl: string }> {
  // Note: Full PDF to image requires PDF.js library
  // This is a placeholder - you'll need to add pdf.js-dist package
  return new Promise((resolve, reject) => {
    // For now, we'll show a message that PDF.js is needed
    reject(new Error('PDF to Image conversion requires PDF.js library. Please install pdf.js-dist package.'));
  });
}

// HEIC to JPG (requires heic2any library)
export async function heicToJpg(file: File): Promise<{ blob: Blob; dataUrl: string }> {
  // Note: HEIC conversion requires heic2any library
  // This is a placeholder
  return new Promise((resolve, reject) => {
    reject(new Error('HEIC conversion requires heic2any library. Please install heic2any package.'));
  });
}

// Social media presets
export const socialMediaPresets = {
  'instagram-post': { width: 1080, height: 1080, name: 'Instagram Post (Square)' },
  'instagram-story': { width: 1080, height: 1920, name: 'Instagram Story' },
  'facebook-cover': { width: 1200, height: 630, name: 'Facebook Cover' },
  'facebook-post': { width: 1200, height: 630, name: 'Facebook Post' },
  'twitter-header': { width: 1500, height: 500, name: 'Twitter Header' },
  'twitter-post': { width: 1200, height: 675, name: 'Twitter Post' },
  'linkedin-cover': { width: 1584, height: 396, name: 'LinkedIn Cover' },
  'youtube-thumbnail': { width: 1280, height: 720, name: 'YouTube Thumbnail' },
  'pinterest-pin': { width: 1000, height: 1500, name: 'Pinterest Pin' },
};

