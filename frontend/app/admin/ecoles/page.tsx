'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, GraduationCap, X } from 'lucide-react';
import api from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';

interface SchoolFull {
  id: number; name: string; address: string | null; city: string | null;
  contactName: string | null; contactEmail: string | null; contactPhone: string | null;
  logoUrl: string | null; coverImageUrl: string | null; description: string | null;
  status: string; _count?: { volunteers: number };
}

const emptyForm = {
  name: '', address: '', city: '', contactName: '', contactEmail: '', contactPhone: '',
  logoUrl: null as string | null, coverImageUrl: null as string | null, description: '', status: 'ACTIVE',
};

export default function AdminEcolesPage() {
  const [schools, setSchools] = useState<SchoolFull[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchSchools = () => {
    api.get('/api/schools/all').then(res => setSchools(res.data.data)).catch(() => {});
  };

  useEffect(() => { fetchSchools(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form, address: form.address || null, city: form.city || null,
      contactName: form.contactName || null, contactEmail: form.contactEmail || null,
      contactPhone: form.contactPhone || null, description: form.description || null,
    };
    try {
      if (editing) await api.put(`/api/schools/${editing}`, payload);
      else await api.post('/api/schools', payload);
      fetchSchools(); resetForm();
    } catch { alert('Erreur'); }
    setLoading(false);
  };

  const handleEdit = (s: SchoolFull) => {
    setForm({
      name: s.name, address: s.address || '', city: s.city || '',
      contactName: s.contactName || '', contactEmail: s.contactEmail || '', contactPhone: s.contactPhone || '',
      logoUrl: s.logoUrl, coverImageUrl: s.coverImageUrl, description: s.description || '', status: s.status,
    });
    setEditing(s.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette école ?')) return;
    await api.delete(`/api/schools/${id}`); fetchSchools();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{schools.length} école(s) au total</p>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm">
            <Plus className="h-4 w-4" /> Ajouter une école
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">{editing ? 'Modifier l\'école' : 'Nouvelle école partenaire'}</CardTitle>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="h-5 w-5" /></button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Nom de l&apos;école *</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Ville</Label>
                  <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Adresse</Label>
                  <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Personne de contact</Label>
                  <Input value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Email contact</Label>
                  <Input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Téléphone contact</Label>
                  <Input value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="h-10" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Logo</Label>
                  <ImageUpload value={form.logoUrl} onChange={(url) => setForm({ ...form, logoUrl: url })} category="PARTNER" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Image de couverture</Label>
                  <ImageUpload value={form.coverImageUrl} onChange={(url) => setForm({ ...form, coverImageUrl: url })} category="PARTNER" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Statut</Label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full h-10 border rounded-lg px-3 text-sm bg-white">
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 px-6">
                  {loading ? 'Enregistrement...' : (editing ? 'Mettre à jour' : 'Créer l\'école')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {schools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {schools.map((s) => (
            <Card key={s.id} className={`overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow group ${s.status !== 'ACTIVE' ? 'opacity-50' : ''}`}>
              {s.coverImageUrl ? (
                <div className="relative h-40"><img src={s.coverImageUrl} alt={s.name} className="w-full h-full object-cover" /></div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                  <GraduationCap className="h-12 w-12 text-indigo-200" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  {s.logoUrl ? <img src={s.logoUrl} alt="" className="w-10 h-10 rounded-lg object-cover shadow-sm" /> : (
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center"><GraduationCap className="h-5 w-5 text-indigo-400" /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{s.name}</h3>
                    {s.city && <p className="text-sm text-gray-500">{s.city}</p>}
                  </div>
                </div>
                {s.description && <p className="text-sm text-gray-500 line-clamp-2 mb-2">{s.description}</p>}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {s._count && <Badge className="bg-blue-50 text-blue-700 border-0 text-xs">{s._count.volunteers} bénévole(s)</Badge>}
                    {s.status !== 'ACTIVE' && <Badge className="bg-gray-100 text-gray-500 border-0 text-xs">Inactive</Badge>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(s)} className="p-1.5 rounded-lg hover:bg-gray-100"><Pencil className="h-3.5 w-3.5 text-gray-500" /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showForm ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="h-8 w-8 text-indigo-300" />
          </div>
          <p className="text-gray-500 font-medium">Aucune école partenaire</p>
          <p className="text-sm text-gray-400 mt-1">Ajoutez des écoles partenaires pour commencer.</p>
        </div>
      ) : null}
    </div>
  );
}
