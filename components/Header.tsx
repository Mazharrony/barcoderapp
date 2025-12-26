'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allToolsOpen, setAllToolsOpen] = useState(false);
  const pathname = usePathname();
  
  const navLinks = [
    { href: '/', label: 'Home' },
  ];

  const allTools = [
    // Generators
    { href: '/barcode-generator', label: 'Barcode Generator', category: 'Generators', icon: '📊' },
    { href: '/qr-code-generator', label: 'QR Code Generator', category: 'Generators', icon: '🔲' },
    
    // Image Tools
    { href: '/image-tools/compressor', label: 'Image Compressor', category: 'Image Tools', icon: '📦' },
    { href: '/image-tools/converter', label: 'Image Converter', category: 'Image Tools', icon: '🔄' },
    { href: '/image-tools/resizer', label: 'Image Resizer', category: 'Image Tools', icon: '📏' },
    { href: '/image-tools/cropper', label: 'Image Cropper', category: 'Image Tools', icon: '✂️' },
    { href: '/image-tools/image-to-pdf', label: 'Image to PDF', category: 'Image Tools', icon: '📄' },
    { href: '/image-tools/pdf-to-image', label: 'PDF to Image', category: 'Image Tools', icon: '🖼️' },
    { href: '/image-tools/heic-to-jpg', label: 'HEIC to JPG', category: 'Image Tools', icon: '📱' },
    { href: '/image-tools/bg-remover', label: 'BG Remover', category: 'Image Tools', icon: '🎨' },
    { href: '/png-to-jpeg', label: 'PNG to JPEG', category: 'Image Tools', icon: '🖼️' },
    
    // PDF Tools
    { href: '/pdf-tools/merge-pdf', label: 'Merge PDF', category: 'PDF Tools', icon: '📄' },
    { href: '/pdf-tools/split-pdf', label: 'Split PDF', category: 'PDF Tools', icon: '✂️' },
    { href: '/pdf-tools/compress-pdf', label: 'Compress PDF', category: 'PDF Tools', icon: '📦' },
    { href: '/pdf-tools/lock-pdf', label: 'Lock PDF', category: 'PDF Tools', icon: '🔒' },
    { href: '/pdf-tools/unlock-pdf', label: 'Unlock PDF', category: 'PDF Tools', icon: '🔓' },
    { href: '/pdf-tools/add-page-numbers', label: 'Add Page Numbers', category: 'PDF Tools', icon: '🔢' },
    { href: '/pdf-tools/rotate-pdf', label: 'Rotate PDF', category: 'PDF Tools', icon: '🔄' },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-[#E5E7EB] dark:bg-[#0B1220] dark:border-gray-800 relative">
      <div className="container mx-auto px-4 h-full max-w-7xl relative">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">XO</span>
            </div>
            <span className="text-[#0F172A] dark:text-[#E5E7EB] font-semibold text-lg lowercase">
              xotools
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-[#2563EB] dark:text-[#3B82F6]'
                    : 'text-[#475569] hover:text-[#2563EB] dark:text-[#64748B] dark:hover:text-[#3B82F6]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* All Tools Mega Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setAllToolsOpen(true)}
              onMouseLeave={() => setAllToolsOpen(false)}
            >
              <button className="px-4 py-2 text-sm font-medium text-white bg-[#2563EB] rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-1">
                All Tools
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {allToolsOpen && (
                <div className="absolute top-full right-0 mt-2 w-[800px] bg-white dark:bg-[#0B1220] border border-[#E5E7EB] dark:border-gray-800 rounded-lg shadow-xl z-50 max-h-[600px] overflow-y-auto">
                  <div className="p-6 grid grid-cols-3 gap-6">
                    {/* Generators */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#E5E7EB] uppercase mb-3 pb-2 border-b border-[#E5E7EB] dark:border-gray-800">
                        Generators
                      </h3>
                      <div className="space-y-2">
                        {allTools.filter(t => t.category === 'Generators').map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                              pathname === tool.href
                                ? 'text-[#2563EB] bg-[#F1F5F9] dark:text-[#3B82F6] dark:bg-[#111827]'
                                : 'text-[#475569] hover:bg-[#F8FAFC] dark:text-[#64748B] dark:hover:bg-[#111827]'
                            }`}
                          >
                            <span className="text-lg">{tool.icon}</span>
                            <span className="text-sm">{tool.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    {/* Image Tools */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#E5E7EB] uppercase mb-3 pb-2 border-b border-[#E5E7EB] dark:border-gray-800">
                        Image Tools
                      </h3>
                      <div className="space-y-2">
                        {allTools.filter(t => t.category === 'Image Tools').map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                              pathname === tool.href
                                ? 'text-[#2563EB] bg-[#F1F5F9] dark:text-[#3B82F6] dark:bg-[#111827]'
                                : 'text-[#475569] hover:bg-[#F8FAFC] dark:text-[#64748B] dark:hover:bg-[#111827]'
                            }`}
                          >
                            <span className="text-lg">{tool.icon}</span>
                            <span className="text-sm">{tool.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                    
                    {/* PDF Tools */}
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#E5E7EB] uppercase mb-3 pb-2 border-b border-[#E5E7EB] dark:border-gray-800">
                        PDF Tools
                      </h3>
                      <div className="space-y-2">
                        {allTools.filter(t => t.category === 'PDF Tools').map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                              pathname === tool.href
                                ? 'text-[#2563EB] bg-[#F1F5F9] dark:text-[#3B82F6] dark:bg-[#111827]'
                                : 'text-[#475569] hover:bg-[#F8FAFC] dark:text-[#64748B] dark:hover:bg-[#111827]'
                            }`}
                          >
                            <span className="text-lg">{tool.icon}</span>
                            <span className="text-sm">{tool.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#475569] hover:bg-[#F8FAFC] dark:text-[#64748B] dark:hover:bg-[#111827] transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-[#E5E7EB] dark:bg-[#0B1220] dark:border-gray-800 max-h-[80vh] overflow-y-auto">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-[#2563EB] bg-[#F1F5F9] dark:text-[#3B82F6] dark:bg-[#111827]'
                      : 'text-[#475569] hover:bg-[#F8FAFC] dark:text-[#64748B] dark:hover:bg-[#111827]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* All Tools in Mobile */}
              <div className="border-t border-[#E5E7EB] dark:border-gray-800 pt-4 mt-4">
                <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase mb-3 px-4">All Tools</div>
                <div className="space-y-1">
                  {/* Generators */}
                  <div className="px-4 mb-3">
                    <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase mb-2">Generators</div>
                    {allTools.filter(t => t.category === 'Generators').map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === tool.href
                            ? 'text-[#2563EB] bg-[#F1F5F9] dark:text-[#3B82F6] dark:bg-[#111827]'
                            : 'text-[#475569] hover:bg-[#F8FAFC] dark:text-[#64748B] dark:hover:bg-[#111827]'
                        }`}
                      >
                        <span>{tool.icon}</span>
                        <span>{tool.label}</span>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Image Tools */}
                  <div className="px-4 mb-3">
                    <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase mb-2">Image Tools</div>
                    {allTools.filter(t => t.category === 'Image Tools').map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === tool.href
                            ? 'text-[#2563EB] bg-[#F1F5F9] dark:text-[#3B82F6] dark:bg-[#111827]'
                            : 'text-[#475569] hover:bg-[#F8FAFC] dark:text-[#64748B] dark:hover:bg-[#111827]'
                        }`}
                      >
                        <span>{tool.icon}</span>
                        <span>{tool.label}</span>
                      </Link>
                    ))}
                  </div>
                  
                  {/* PDF Tools */}
                  <div className="px-4 mb-3">
                    <div className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase mb-2">PDF Tools</div>
                    {allTools.filter(t => t.category === 'PDF Tools').map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          pathname === tool.href
                            ? 'text-[#2563EB] bg-[#F1F5F9] dark:text-[#3B82F6] dark:bg-[#111827]'
                            : 'text-[#475569] hover:bg-[#F8FAFC] dark:text-[#64748B] dark:hover:bg-[#111827]'
                        }`}
                      >
                        <span>{tool.icon}</span>
                        <span>{tool.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

