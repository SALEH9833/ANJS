import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import LayoutShell from '@/components/LayoutShell';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-sans',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    default: 'ANJS — Association Nova Jeunesse pour la Solidarité',
    template: '%s | ANJS',
  },
  description: 'Association de lycéens qui aident des personnes démunies en collaboration avec des écoles et associations partenaires.',
  keywords: ['association', 'solidarité', 'bénévolat', 'aide', 'jeunesse', 'Tchad'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'ANJS',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={cn('font-sans', geistSans.variable)}>
      <body className="antialiased bg-background text-foreground flex flex-col min-h-screen">
        <LayoutShell>{children}</LayoutShell>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
