import type { Metadata } from "next";
import UnlockPDF from '@/components/UnlockPDF';
import { siteUrl } from '@/lib/seo-config';

export const metadata: Metadata = {
  title: "Unlock PDF - Remove Password Protection | Free PDF Unlocker Tool",
  description: "Remove password protection from PDF files. Free online PDF unlocker tool - unlock encrypted PDFs with password. No registration required.",
  keywords: "unlock pdf, remove pdf password, pdf unlocker, decrypt pdf, unlock password protected pdf, remove pdf encryption, pdf password remover",
  alternates: {
    canonical: `${siteUrl}/pdf-tools/unlock-pdf`,
  },
  openGraph: {
    title: "Unlock PDF - Free PDF Unlocker Tool",
    description: "Remove password protection from PDF files. Free online PDF unlocker - decrypt PDFs with password.",
    url: `${siteUrl}/pdf-tools/unlock-pdf`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlock PDF - Free PDF Unlocker",
    description: "Remove password protection from PDF files. Free, secure, and easy to use.",
  },
};

export default function UnlockPDFPage() {
  return <UnlockPDF />;
}



