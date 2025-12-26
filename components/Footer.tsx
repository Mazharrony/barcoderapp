'use client';

import Link from 'next/link';
import { categories } from '@/lib/tools-data';
import { siteConfig } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#0B1220]">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories#${category.id}`}
                className="text-sm text-[#475569] dark:text-[#64748B] hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* PayPal Donation Button */}
          <a
            href={siteConfig.paypalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#475569] dark:text-[#64748B] hover:text-[#2563EB] dark:hover:text-[#3B82F6] transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.203zm14.146-14.42a.543.543 0 0 0-.414-.205h-3.74c-.235 0-.44.168-.488.4l-.747 4.8c-.048.235.12.46.355.46h3.77c.235 0 .44-.168.488-.4l.747-4.8a.543.543 0 0 0-.073-.455z"/>
            </svg>
            <span>Support via PayPal</span>
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-[#E5E7EB] dark:border-gray-800 text-center">
          <p className="text-xs text-[#64748B] dark:text-[#64748B]">
            © {new Date().getFullYear()} xotools. Made with{' '}
            <span className="text-red-500">❤️</span> for the community
          </p>
        </div>
      </div>
    </footer>
  );
}
