import type { Metadata } from "next";
import Hero from '@/components/Hero';
import ToolCategories from '@/components/ToolCategories';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Fast & Free Online Tools | xotools.io",
  description: "Convert images, generate QR codes, work with PDFs & more — instantly. Free online tools for everyone.",
  alternates: {
    canonical: siteUrl,
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <ToolCategories />
    </main>
  );
}
