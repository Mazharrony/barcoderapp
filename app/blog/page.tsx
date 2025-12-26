import type { Metadata } from "next";
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Blog | xotools",
  description: "Tips, tutorials, and guides for using online tools effectively.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B1220]">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-[#0F172A] dark:text-[#E5E7EB] mb-4">
          Blog
        </h1>
        <p className="text-lg text-[#475569] dark:text-[#64748B] mb-8">
          Coming soon...
        </p>
      </div>
    </main>
  );
}

