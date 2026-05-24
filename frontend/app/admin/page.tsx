'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users, GraduationCap, Handshake, HandHeart,
  CalendarDays, BookOpen, Mail, Heart,
  BarChart3, TrendingUp, ArrowRight, Clock,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';
import type { AdminStats } from '@/lib/types';
import { formatAmount } from '@/lib/utils';

interface ChartData {
  donsByMonth: { name: string; montant: number }[];
  recentDonations: { id: number; donorName: string | null; amount: number; status: string; isAnonymous: boolean; createdAt: string }[];
  recentMessages: { id: number; name: string; subject: string; isRead: boolean; createdAt: string }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<{ data: AdminStats }>('/api/admin/stats'),
      api.get<{ data: ChartData }>('/api/admin/chart-data'),
    ]).then(([statsRes, chartRes]) => {
      setStats(statsRes.data.data);
      setChart(chartRes.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: 'Bénévoles actifs', value: stats.volunteers.active, total: stats.volunteers.total, icon: Users, bg: 'bg-blue-50', iconColor: 'text-blue-600', badgeBg: 'bg-blue-100 text-blue-700', href: '/admin/benevoles' },
    { label: 'Écoles', value: stats.schools, icon: GraduationCap, bg: 'bg-indigo-50', iconColor: 'text-indigo-600', badgeBg: 'bg-indigo-100 text-indigo-700', href: '/admin/ecoles' },
    { label: 'Partenaires', value: stats.partners, icon: Handshake, bg: 'bg-purple-50', iconColor: 'text-purple-600', badgeBg: 'bg-purple-100 text-purple-700', href: '/admin/partenaires' },
    { label: 'Bénéficiaires aidés', value: stats.beneficiaries.helped, total: stats.beneficiaries.total, icon: HandHeart, bg: 'bg-green-50', iconColor: 'text-green-600', badgeBg: 'bg-green-100 text-green-700' },
    { label: 'Demandes en attente', value: stats.aidRequests.PENDING ?? 0, total: stats.aidRequests.total, icon: BarChart3, bg: 'bg-orange-50', iconColor: 'text-orange-600', badgeBg: 'bg-orange-100 text-orange-700' },
    { label: 'Événements à venir', value: stats.events.upcoming, icon: CalendarDays, bg: 'bg-pink-50', iconColor: 'text-pink-600', badgeBg: 'bg-pink-100 text-pink-700', href: '/admin/evenements' },
    { label: 'Articles publiés', value: stats.articles.published, icon: BookOpen, bg: 'bg-teal-50', iconColor: 'text-teal-600', badgeBg: 'bg-teal-100 text-teal-700', href: '/admin/articles' },
    { label: 'Messages non lus', value: stats.contacts.unread, icon: Mail, bg: 'bg-red-50', iconColor: 'text-red-600', badgeBg: 'bg-red-100 text-red-700', href: '/admin/messages' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTooltip = (value: any) => formatAmount(Number(value));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Vue d&apos;ensemble</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((c) => {
            const Inner = (
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${c.bg}`}>
                      <c.icon className={`h-5 w-5 ${c.iconColor}`} />
                    </div>
                    {c.total !== undefined && (
                      <Badge className={`${c.badgeBg} border-0 text-xs font-semibold`}>/ {c.total}</Badge>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{c.value}</div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-500">{c.label}</p>
                    {c.href && <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 transition-colors" />}
                  </div>
                </CardContent>
              </Card>
            );
            return c.href ? <Link key={c.label} href={c.href}>{Inner}</Link> : <div key={c.label}>{Inner}</div>;
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Dons — 6 derniers mois</h3>
                  <p className="text-xs text-gray-400">Évolution des dons confirmés</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{formatAmount(Number(stats.donations.totalAmount))}</p>
                <p className="text-xs text-gray-400">{stats.donations.totalConfirmed} don(s)</p>
              </div>
            </div>
            {chart && chart.donsByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={chart.donsByMonth}>
                  <defs>
                    <linearGradient id="colorMontant" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={formatTooltip} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                  <Area type="monotone" dataKey="montant" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorMontant)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-gray-400 text-sm">Aucun don sur cette période</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Activité récente</h3>
                <p className="text-xs text-gray-400">Derniers événements</p>
              </div>
            </div>
            <div className="space-y-1">
              {chart?.recentDonations.map((d) => (
                <div key={`d-${d.id}`} className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Heart className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{d.isAnonymous ? 'Don anonyme' : (d.donorName || 'Donateur')}</p>
                    <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 shrink-0">{formatAmount(d.amount)}</span>
                </div>
              ))}
              {chart?.recentMessages.map((m) => (
                <div key={`m-${m.id}`} className="flex items-center gap-3 py-2.5 border-b border-gray-50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.isRead ? 'bg-gray-50' : 'bg-red-50'}`}>
                    <Mail className={`h-3.5 w-3.5 ${m.isRead ? 'text-gray-400' : 'text-red-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${m.isRead ? 'text-gray-500' : 'font-medium text-gray-700'}`}>{m.name}</p>
                    <p className="text-xs text-gray-400 truncate">{m.subject}</p>
                  </div>
                </div>
              ))}
              {(!chart?.recentDonations.length && !chart?.recentMessages.length) && (
                <p className="text-sm text-gray-400 text-center py-8">Aucune activité récente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Demandes d&apos;aide</h3>
            <div className="space-y-3">
              {[
                { label: 'En attente', value: stats.aidRequests.PENDING ?? 0, color: 'bg-orange-500' },
                { label: 'En cours', value: stats.aidRequests.IN_PROGRESS ?? 0, color: 'bg-blue-500' },
                { label: 'Complétées', value: stats.aidRequests.FULFILLED ?? 0, color: 'bg-green-500' },
              ].map((item) => {
                const pct = stats.aidRequests.total > 0 ? (item.value / stats.aidRequests.total) * 100 : 0;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold text-gray-900">{item.value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Raccourcis</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Contenu', href: '/admin/contenu', icon: BookOpen, bg: 'bg-emerald-50', color: 'text-emerald-600' },
                { label: 'Membres', href: '/admin/membres', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
                { label: 'Articles', href: '/admin/articles', icon: BookOpen, bg: 'bg-amber-50', color: 'text-amber-600' },
                { label: 'Messages', href: '/admin/messages', icon: Mail, bg: 'bg-red-50', color: 'text-red-600' },
              ].map((s) => (
                <Link key={s.label} href={s.href}>
                  <div className={`${s.bg} rounded-xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer group`}>
                    <s.icon className={`h-6 w-6 ${s.color} mx-auto mb-2`} />
                    <p className="text-sm font-medium text-gray-700">{s.label}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
