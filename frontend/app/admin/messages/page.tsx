'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, MailOpen, Trash2, X } from 'lucide-react';
import api from '@/lib/api';
import type { ContactMessage } from '@/lib/types';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const fetchData = () => { api.get('/api/contact').then(r => setMessages(r.data.data)).catch(() => {}); };
  useEffect(() => { fetchData(); }, []);

  const markRead = async (id: number) => {
    await api.put(`/api/contact/${id}`, { isRead: true });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return;
    await api.delete(`/api/contact/${id}`);
    if (selected?.id === id) setSelected(null);
    fetchData();
  };

  const openMessage = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.isRead) {
      await markRead(msg.id);
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-500">{messages.length} message(s)</p>
        {unreadCount > 0 && <Badge className="bg-red-100 text-red-700 border-0">{unreadCount} non lu(s)</Badge>}
      </div>

      <div className="flex gap-6 h-[calc(100vh-12rem)]">
        <div className="w-full md:w-96 shrink-0 overflow-y-auto space-y-2">
          {messages.length > 0 ? messages.map((msg) => (
            <Card
              key={msg.id}
              onClick={() => openMessage(msg)}
              className={`border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${selected?.id === msg.id ? 'ring-2 ring-emerald-500' : ''} ${!msg.isRead ? 'bg-emerald-50/50' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {!msg.isRead ? <Mail className="h-4 w-4 text-emerald-600 shrink-0" /> : <MailOpen className="h-4 w-4 text-gray-300 shrink-0" />}
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${!msg.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{msg.name}</p>
                      <p className="text-xs text-gray-400 truncate">{msg.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <p className={`text-sm mt-2 truncate ${!msg.isRead ? 'font-medium text-gray-800' : 'text-gray-500'}`}>{msg.subject}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{msg.message}</p>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4"><Mail className="h-8 w-8 text-emerald-300" /></div>
              <p className="text-gray-500 font-medium">Aucun message</p>
            </div>
          )}
        </div>

        {selected && (
          <Card className="hidden md:flex flex-1 border-0 shadow-sm flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{selected.subject}</h3>
                <p className="text-sm text-gray-500 mt-0.5">De {selected.name} &lt;{selected.email}&gt; — {new Date(selected.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDelete(selected.id)} className="gap-1 text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer
                </Button>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="h-5 w-5 text-gray-400" /></button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
