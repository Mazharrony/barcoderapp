import type { Metadata } from "next";
import ToolCategories from '@/components/ToolCategories';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Tool Categories | xotools",
  description: "Browse tools by category - Image Tools, PDF Tools, Text Tools, Generators, Developer Tools, and Calculators.",
  alternates: {
    canonical: `${siteUrl}/categories`,
  },
};

export default function CategoriesPage() {
  return (
    <main>
      <div className="bg-white dark:bg-[#0B1220] py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl font-bold text-[#0F172A] dark:text-[#E5E7EB] mb-4">
            Categories
          </h1>
          <p className="text-lg text-[#475569] dark:text-[#64748B]">
            Explore tools organized by category
          </p>
        </div>
      </div>
      <ToolCategories />
    </main>
  );
}

