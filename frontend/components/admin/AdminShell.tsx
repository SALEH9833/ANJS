'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, UserCircle, GraduationCap, Handshake,
  Users, CalendarDays, BookOpen, Mail, Heart, Image,
  LogOut, Leaf, Menu, X, ChevronRight, FileText,
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { type: 'separator', label: 'Contenu' },
  { label: 'Contenu du site', href: '/admin/contenu', icon: FileText },
  { label: 'Membres', href: '/admin/membres', icon: UserCircle },
  { label: 'Bénévoles', href: '/admin/benevoles', icon: Users },
  { label: 'Écoles partenaires', href: '/admin/ecoles', icon: GraduationCap },
  { label: 'Partenariats', href: '/admin/partenaires', icon: Handshake },
  { type: 'separator', label: 'Communication' },
  { label: 'Événements', href: '/admin/evenements', icon: CalendarDays },
  { label: 'Articles', href: '/admin/articles', icon: BookOpen },
  { label: 'Messages', href: '/admin/messages', icon: Mail },
  { type: 'separator', label: 'Finance' },
  { label: 'Dons', href: '/admin/dons', icon: Heart },
  { type: 'separator', label: 'Médias' },
  { label: 'Médiathèque', href: '/admin/medias', icon: Image },
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('anjs_admin_token');
    if (!token) {
      router.push('/admin/login');
    } else {
      setReady(true);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('anjs_admin_token');
    router.push('/admin/login');
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-100 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/30">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-emerald-800 text-base">ANJS</span>
            <span className="block text-[10px] text-gray-400 font-medium -mt-0.5 uppercase tracking-wider">Administration</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {SIDEBAR_ITEMS.map((item, i) => {
            if ('type' in item && item.type === 'separator') {
              return (
                <div key={i} className="pt-4 pb-1 px-3">
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{item.label}</span>
                </div>
              );
            }
            if (!('href' in item)) return null;
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600')} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 text-emerald-400" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors mb-1"
          >
            <Leaf className="h-4 w-4" />
            Voir le site
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 shrink-0 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 mr-3">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-800">
              {SIDEBAR_ITEMS.find(item => 'href' in item && item.href === pathname)?.label ?? 'Administration'}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
