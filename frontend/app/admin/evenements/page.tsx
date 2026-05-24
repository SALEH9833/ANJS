'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Calendar, X, MapPin } from 'lucide-react';
import api from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';

interface Event {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startDate: string;
  endDate: string | null;
  location: string | null;
  status: string;
}

const emptyForm = {
  title: '', description: '', imageUrl: null as string | null, startDate: '', endDate: '', location: '', status: 'UPCOMING',
};

function formatDateInput(d: string | null) {
  if (!d) return '';
  return d.slice(0, 16);
}

export default function AdminEvenementsPage() {
  const [items, setItems] = useState<Event[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchData = () => { api.get('/api/events/all').then(r => setItems(r.data.data)).catch(() => {}); };
  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      description: form.description || null,
      location: form.location || null,
      startDate: new Date(form.startDate).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
    };
    try {
      if (editing) { await api.put(`/api/events/${editing}`, payload); }
      else { await api.post('/api/events', payload); }
      fetchData();
      resetForm();
    } catch { alert('Erreur lors de l\'enregistrement'); }
    setLoading(false);
  };

  const handleEdit = (ev: Event) => {
    setForm({ title: ev.title, description: ev.description || '', imageUrl: ev.imageUrl, startDate: formatDateInput(ev.startDate), endDate: formatDateInput(ev.endDate), location: ev.location || '', status: ev.status });
    setEditing(ev.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet événement ?')) return;
    await api.delete(`/api/events/${id}`);
    fetchData();
  };

  const statusColor = (s: string) => {
    if (s === 'UPCOMING') return 'bg-blue-100 text-blue-800';
    if (s === 'ONGOING') return 'bg-green-100 text-green-800';
    if (s === 'COMPLETED') return 'bg-gray-100 text-gray-600';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} événement(s)</p>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm">
            <Plus className="h-4 w-4" /> Ajouter un événement
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">{editing ? 'Modifier' : 'Nouvel événement'}</CardTitle>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="h-5 w-5" /></button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Titre *</Label>
                  <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Date de début *</Label>
                  <Input type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Date de fin</Label>
                  <Input type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Lieu</Label>
                  <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Ex: N'Djamena" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Statut</Label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="UPCOMING">À venir</option>
                    <option value="ONGOING">En cours</option>
                    <option value="COMPLETED">Terminé</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Image</Label>
                <ImageUpload value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} category="EVENT" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 px-6">
                  {loading ? 'Enregistrement...' : (editing ? 'Mettre à jour' : 'Créer')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((ev) => (
            <Card key={ev.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-40 relative bg-gradient-to-br from-emerald-50 to-teal-50">
                {ev.imageUrl ? (
                  <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Calendar className="h-12 w-12 text-emerald-200" /></div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(ev)} className="p-1.5 bg-white rounded-lg shadow-md hover:bg-emerald-50"><Pencil className="h-3.5 w-3.5 text-gray-600" /></button>
                  <button onClick={() => handleDelete(ev.id)} className="p-1.5 bg-white rounded-lg shadow-md hover:bg-red-50"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
                </div>
                <Badge className={`absolute top-2 left-2 border-0 text-[10px] ${statusColor(ev.status)}`}>
                  {ev.status === 'UPCOMING' ? 'À venir' : ev.status === 'ONGOING' ? 'En cours' : ev.status === 'COMPLETED' ? 'Terminé' : 'Annulé'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900">{ev.title}</h3>
                <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(ev.startDate).toLocaleDateString('fr-FR')}</p>
                {ev.location && <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showForm ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4"><Calendar className="h-8 w-8 text-emerald-300" /></div>
          <p className="text-gray-500 font-medium">Aucun événement</p>
        </div>
      ) : null}
    </div>
  );
}
