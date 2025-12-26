import type { Metadata } from "next";
import ToolCategories from '@/components/ToolCategories';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "All Tools | xotools",
  description: "Browse all free online tools - image converters, PDF tools, generators, and more.",
  alternates: {
    canonical: `${siteUrl}/tools`,
  },
};

export default function AllToolsPage() {
  return (
    <main>
      <div className="bg-white dark:bg-[#0B1220] py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl font-bold text-[#0F172A] dark:text-[#E5E7EB] mb-4">
            All Tools
          </h1>
          <p className="text-lg text-[#475569] dark:text-[#64748B]">
            Discover all our free online tools
          </p>
        </div>
      </div>
      <ToolCategories />
    </main>
  );
}

