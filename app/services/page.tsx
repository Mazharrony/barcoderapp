import type { Metadata } from "next";
import { siteUrl } from '@/lib/seo-config';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: "Services & Work Proposal | xotools",
  description: "Professional design solutions - Web Development, Mobile App Development, and Packaging Design. Let's work together on your next project!",
  alternates: {
    canonical: `${siteUrl}/services`,
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B1220]">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-[#2563EB]/10 dark:bg-[#3B82F6]/20 rounded-xl">
                <svg className="w-8 h-8 text-[#2563EB] dark:text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-[#E5E7EB]">
                Work Proposal
              </h1>
            </div>
            <p className="text-lg text-[#475569] dark:text-[#64748B] max-w-2xl mx-auto">
              I specialize in creating professional design solutions. Let&apos;s work together on your next project!
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Web Development */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg w-fit mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#E5E7EB] mb-2">
                Web Development
              </h3>
              <p className="text-[#475569] dark:text-[#64748B]">
                Custom websites, web applications, and interactive experiences
              </p>
            </div>

            {/* Mobile App Development */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg w-fit mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#E5E7EB] mb-2">
                Mobile App Development
              </h3>
              <p className="text-[#475569] dark:text-[#64748B]">
                iOS and Android applications with modern UI/UX design
              </p>
            </div>

            {/* Packaging Design */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg w-fit mb-4">
                <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#E5E7EB] mb-2">
                Packaging Design
              </h3>
              <p className="text-[#475569] dark:text-[#64748B]">
                Creative packaging solutions, labels, and brand identity design
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-lg shadow-green-500/30 hover:shadow-xl"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>
      </main>
  );
}

