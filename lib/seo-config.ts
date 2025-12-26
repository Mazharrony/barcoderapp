// SEO Configuration
// Update NEXT_PUBLIC_SITE_URL in your .env.local file with your actual domain

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';

export const seoConfig = {
  siteName: 'xotools',
  title: 'Fast & Free Online Tools | xotools.io',
  description: 'Convert images, generate QR codes, work with PDFs & more — instantly. Free online tools for everyone.',
  keywords: [
    'online tools',
    'free tools',
    'image converter',
    'PDF tools',
    'QR code generator',
    'barcode generator',
    'image compressor',
    'image resizer',
    'text tools',
    'developer tools',
    'calculator',
  ],
  author: 'xotools',
  locale: 'en_US',
  ogImage: '/og-image.png', // You'll need to create this image (1200x630px)
};

