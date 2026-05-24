'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Users, X } from 'lucide-react';
import api from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';

interface Volunteer {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  photoUrl: string | null;
  bio: string | null;
  status: string;
  schoolId: number | null;
  school?: { id: number; name: string; city: string } | null;
}

interface School {
  id: number;
  name: string;
  city: string | null;
}

const emptyForm = {
  firstName: '', lastName: '', email: '', phone: '', bio: '', photoUrl: null as string | null, status: 'ACTIVE', schoolId: null as number | null,
};

export default function AdminBenevolesPage() {
  const [items, setItems] = useState<Volunteer[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    api.get('/api/volunteers/all').then(r => setItems(r.data.data)).catch(() => {});
    api.get('/api/schools').then(r => setSchools(r.data.data)).catch(() => {});
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, email: form.email || null, phone: form.phone || null, bio: form.bio || null };
    try {
      if (editing) {
        await api.put(`/api/volunteers/${editing}`, payload);
      } else {
        await api.post('/api/volunteers', payload);
      }
      fetchData();
      resetForm();
    } catch { alert('Erreur lors de l\'enregistrement'); }
    setLoading(false);
  };

  const handleEdit = (v: Volunteer) => {
    setForm({ firstName: v.firstName, lastName: v.lastName, email: v.email || '', phone: v.phone || '', bio: v.bio || '', photoUrl: v.photoUrl, status: v.status, schoolId: v.schoolId });
    setEditing(v.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce bénévole ?')) return;
    await api.delete(`/api/volunteers/${id}`);
    fetchData();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} bénévole(s)</p>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm">
            <Plus className="h-4 w-4" /> Ajouter un bénévole
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">{editing ? 'Modifier le bénévole' : 'Nouveau bénévole'}</CardTitle>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="h-5 w-5" /></button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Prénom *</Label>
                  <Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Nom *</Label>
                  <Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Email *</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">École</Label>
                  <select value={form.schoolId || ''} onChange={e => setForm({ ...form, schoolId: e.target.value ? parseInt(e.target.value) : null })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="">Aucune</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Statut</Label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="ACTIVE">Actif</option>
                    <option value="INACTIVE">Inactif</option>
                    <option value="PENDING">En attente</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Biographie</Label>
                <Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Photo</Label>
                <ImageUpload value={form.photoUrl} onChange={(url) => setForm({ ...form, photoUrl: url })} category="VOLUNTEER" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((v) => (
            <Card key={v.id} className={`overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow group ${v.status !== 'ACTIVE' ? 'opacity-50' : ''}`}>
              <div className="aspect-[4/3] relative bg-gradient-to-br from-emerald-50 to-emerald-100">
                {v.photoUrl ? (
                  <img src={v.photoUrl} alt={`${v.firstName} ${v.lastName}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Users className="h-12 w-12 text-emerald-200" /></div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(v)} className="p-1.5 bg-white rounded-lg shadow-md hover:bg-emerald-50"><Pencil className="h-3.5 w-3.5 text-gray-600" /></button>
                  <button onClick={() => handleDelete(v.id)} className="p-1.5 bg-white rounded-lg shadow-md hover:bg-red-50"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
                </div>
                {v.status !== 'ACTIVE' && <Badge className="absolute top-2 left-2 bg-gray-800/80 text-white border-0 text-[10px]">{v.status === 'PENDING' ? 'En attente' : 'Inactif'}</Badge>}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900">{v.firstName} {v.lastName}</h3>
                {v.school && <p className="text-sm text-emerald-600 font-medium">{v.school.name}</p>}
                {v.email && <p className="text-xs text-gray-400 mt-1">{v.email}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showForm ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4"><Users className="h-8 w-8 text-emerald-300" /></div>
          <p className="text-gray-500 font-medium">Aucun bénévole ajouté</p>
        </div>
      ) : null}
    </div>
  );
}
