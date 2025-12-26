'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { routes } from '@/lib/routes';

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const popularTools = [
    { name: 'QR Code Generator', href: routes.standalone.qrGenerator },
    { name: 'Image Tools', href: routes.categories.image },
    { name: 'PDF Tools', href: routes.categories.pdf },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or filter tools
      router.push(`${routes.categories.tools}?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="bg-white dark:bg-[#0B1220] py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-[#E5E7EB] mb-4">
            Fast & Free Online Tools
          </h1>
          
          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-[#475569] dark:text-[#64748B] mb-8 max-w-2xl mx-auto">
            Convert images, generate QR codes, work with PDFs & more — instantly.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (QR, PDF, Image…)"
                className="w-full px-6 py-4 pr-12 rounded-xl border border-[#E5E7EB] dark:border-gray-700 bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#E5E7EB] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[#64748B] hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
                aria-label="Search"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Popular Tools Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-[#64748B] dark:text-[#64748B]">Popular:</span>
            {popularTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="px-4 py-2 text-sm font-medium text-[#2563EB] dark:text-[#3B82F6] bg-[#F1F5F9] dark:bg-[#111827] rounded-lg hover:bg-[#E5E7EB] dark:hover:bg-[#1F2937] transition-colors"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

