'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Heart, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const NAV = [
  { label: 'Accueil', href: '/' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Membres', href: '/a-propos#membres' },
  { label: 'Bénévoles', href: '/benevoles' },
  { label: 'Aides', href: '/aides' },
  { label: 'Événements', href: '/evenements' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full transition-all duration-300',
      scrolled
        ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-emerald-100'
        : 'bg-transparent'
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg group">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md shadow-emerald-600/30">
            <Leaf className="h-4.5 w-4.5 text-white" />
          </div>
          <span className={cn('transition-colors', scrolled ? 'text-emerald-800' : 'text-emerald-800')}>ANJS</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV.map((item) => {
            const basePath = item.href.split('#')[0];
            const isActive = pathname === basePath || pathname === item.href;
            return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-emerald-700 font-semibold'
                  : 'text-gray-600 hover:text-emerald-700'
              )}
            >
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute inset-0 bg-emerald-50 rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );})}
        </nav>

        <Link href="/dons" className="hidden lg:block">
          <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 rounded-lg">
            <Heart className="h-4 w-4" />
            Faire un don
          </Button>
        </Link>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-emerald-50 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5 text-emerald-800" /> : <Menu className="h-5 w-5 text-emerald-800" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-emerald-100 bg-white overflow-hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3">
              {NAV.map((item) => {
                const bp = item.href.split('#')[0];
                return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                    (pathname === bp || pathname === item.href)
                      ? 'text-emerald-700 font-semibold bg-emerald-50'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/50'
                  )}
                >
                  {item.label}
                </Link>
              );})}
              <Link href="/dons" onClick={() => setOpen(false)}>
                <Button size="sm" className="gap-2 w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">
                  <Heart className="h-4 w-4" />
                  Faire un don
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
