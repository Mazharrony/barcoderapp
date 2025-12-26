import type { Metadata } from "next";
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Login | xotools",
  description: "Login to xotools (optional feature)",
  alternates: {
    canonical: `${siteUrl}/login`,
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B1220]">
      <div className="container mx-auto px-4 py-16 max-w-md">
        <h1 className="text-4xl font-bold text-[#0F172A] dark:text-[#E5E7EB] mb-4">
          Login
        </h1>
        <p className="text-lg text-[#475569] dark:text-[#64748B] mb-8">
          Login is optional. All tools are free to use without registration.
        </p>
      </div>
    </main>
  );
}

