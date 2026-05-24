'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, Users, CheckCircle, XCircle, Phone, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import type { Donation } from '@/lib/types';

function formatXOF(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
}

export default function AdminDonsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, donors: 0 });

  const fetchData = () => {
    api.get('/api/donations').then(r => {
      const data = r.data.data as Donation[];
      setDonations(data);
      const confirmed = data.filter(d => d.status === 'CONFIRMED');
      const pending = data.filter(d => d.status === 'PENDING');
      setStats({
        total: data.reduce((s, d) => s + Number(d.amount), 0),
        confirmed: confirmed.reduce((s, d) => s + Number(d.amount), 0),
        pending: pending.length,
        donors: Array.from(new Set(data.map(d => d.donorEmail).filter(Boolean))).length,
      });
    }).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/api/donations/${id}`, { status });
      toast.success(status === 'CONFIRMED' ? 'Don confirmé' : 'Don annulé');
      fetchData();
    } catch { toast.error('Erreur'); }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Donateur', 'Email', 'Téléphone', 'Montant', 'Méthode', 'Statut', 'Anonyme', 'Date'];
    const rows = filtered.map(d => [
      d.id,
      d.isAnonymous ? 'Anonyme' : (d.donorName || ''),
      d.donorEmail || '',
      d.donorPhone || '',
      Number(d.amount),
      methodLabel(d.paymentMethod),
      d.status,
      d.isAnonymous ? 'Oui' : 'Non',
      new Date(d.createdAt).toLocaleDateString('fr-FR'),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dons-anjs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export CSV téléchargé');
  };

  const statusColor = (s: string) => {
    if (s === 'CONFIRMED') return 'bg-green-100 text-green-800';
    if (s === 'PENDING') return 'bg-amber-100 text-amber-800';
    return 'bg-red-100 text-red-800';
  };

  const methodLabel = (m: string) => {
    const map: Record<string, string> = { AIRTEL_MONEY: 'Airtel Money', MOOV_MONEY: 'Moov Money', BANK_TRANSFER: 'Virement', CASH: 'Espèces', PAYPAL: 'PayPal', OTHER: 'Autre' };
    return map[m] || m;
  };

  const filtered = filter === 'ALL' ? donations : donations.filter(d => d.status === filter);
  const filters = [
    { key: 'ALL', label: 'Tous', count: donations.length },
    { key: 'PENDING', label: 'En attente', count: donations.filter(d => d.status === 'PENDING').length },
    { key: 'CONFIRMED', label: 'Confirmés', count: donations.filter(d => d.status === 'CONFIRMED').length },
    { key: 'CANCELLED', label: 'Annulés', count: donations.filter(d => d.status === 'CANCELLED').length },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center"><TrendingUp className="h-6 w-6 text-emerald-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatXOF(stats.confirmed)}</p>
              <p className="text-sm text-gray-500">Total confirmé</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"><Heart className="h-6 w-6 text-amber-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatXOF(stats.total)}</p>
              <p className="text-sm text-gray-500">Total tous dons</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center"><Filter className="h-6 w-6 text-orange-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-sm text-gray-500">En attente</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><Users className="h-6 w-6 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.donors}</p>
              <p className="text-sm text-gray-500">Donateurs uniques</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.key ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
        {donations.length > 0 && (
          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={exportCSV}>
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        )}
      </div>

      {filtered.length > 0 ? (
        <Card className="border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Donateur</th>
                  <th className="px-5 py-3 text-left">Montant</th>
                  <th className="px-5 py-3 text-left">Méthode</th>
                  <th className="px-5 py-3 text-left">Statut</th>
                  <th className="px-5 py-3 text-left">Date</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900">{d.isAnonymous ? 'Anonyme' : (d.donorName || 'Inconnu')}</p>
                      {d.donorEmail && !d.isAnonymous && <p className="text-xs text-gray-400">{d.donorEmail}</p>}
                      {d.donorPhone && (
                        <p className="text-xs text-gray-400 flex items-center gap-1"><Phone className="h-3 w-3" />{d.donorPhone}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900">{formatXOF(Number(d.amount))}</td>
                    <td className="px-5 py-3 text-gray-500">{methodLabel(d.paymentMethod)}</td>
                    <td className="px-5 py-3">
                      <Badge className={`border-0 text-[10px] ${statusColor(d.status)}`}>
                        {d.status === 'CONFIRMED' ? 'Confirmé' : d.status === 'PENDING' ? 'En attente' : 'Annulé'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-gray-400">{new Date(d.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1.5">
                        {d.status !== 'CONFIRMED' && (
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-green-600 hover:bg-green-50" onClick={() => updateStatus(d.id, 'CONFIRMED')}>
                            <CheckCircle className="h-3.5 w-3.5" /> Confirmer
                          </Button>
                        )}
                        {d.status !== 'CANCELLED' && (
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1 text-red-500 hover:bg-red-50" onClick={() => updateStatus(d.id, 'CANCELLED')}>
                            <XCircle className="h-3.5 w-3.5" /> Annuler
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4"><Heart className="h-8 w-8 text-emerald-300" /></div>
          <p className="text-gray-500 font-medium">{filter === 'ALL' ? 'Aucun don reçu' : 'Aucun don dans cette catégorie'}</p>
        </div>
      )}
    </div>
  );
}
