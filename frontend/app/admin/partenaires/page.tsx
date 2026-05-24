'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Handshake, ExternalLink, X } from 'lucide-react';
import api from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';

interface PartnerFull {
  id: number; name: string; logoUrl: string | null; coverImageUrl: string | null;
  website: string | null; email: string | null; phone: string | null;
  city: string | null; description: string | null; status: string;
}

const emptyForm = {
  name: '', logoUrl: null as string | null, coverImageUrl: null as string | null,
  website: '', email: '', phone: '', city: '', description: '',
};

export default function AdminPartenairesPage() {
  const [partners, setPartners] = useState<PartnerFull[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchPartners = () => {
    api.get('/api/partners').then(res => setPartners(res.data.data)).catch(() => {});
  };

  useEffect(() => { fetchPartners(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form, website: form.website || null, email: form.email || null,
      phone: form.phone || null, city: form.city || null, description: form.description || null,
    };
    try {
      if (editing) await api.put(`/api/partners/${editing}`, payload);
      else await api.post('/api/partners', payload);
      fetchPartners(); resetForm();
    } catch { alert('Erreur'); }
    setLoading(false);
  };

  const handleEdit = (p: PartnerFull) => {
    setForm({
      name: p.name, logoUrl: p.logoUrl, coverImageUrl: p.coverImageUrl,
      website: p.website || '', email: p.email || '', phone: p.phone || '',
      city: p.city || '', description: p.description || '',
    });
    setEditing(p.id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce partenaire ?')) return;
    await api.delete(`/api/partners/${id}`); fetchPartners();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{partners.length} partenaire(s) au total</p>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm">
            <Plus className="h-4 w-4" /> Ajouter un partenaire
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">{editing ? 'Modifier le partenaire' : 'Nouveau partenaire'}</CardTitle>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="h-5 w-5" /></button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Nom *</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Ville</Label>
                  <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Site web</Label>
                  <Input type="url" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://..." className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-10" />
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
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 px-6">
                  {loading ? 'Enregistrement...' : (editing ? 'Mettre à jour' : 'Créer le partenaire')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {partners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {partners.map((p) => (
            <Card key={p.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow group">
              {p.coverImageUrl ? (
                <div className="relative h-40"><img src={p.coverImageUrl} alt={p.name} className="w-full h-full object-cover" /></div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
                  <Handshake className="h-12 w-12 text-purple-200" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  {p.logoUrl ? <img src={p.logoUrl} alt="" className="w-10 h-10 rounded-lg object-cover shadow-sm" /> : (
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center"><Handshake className="h-5 w-5 text-purple-400" /></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                    {p.city && <p className="text-sm text-gray-500">{p.city}</p>}
                  </div>
                </div>
                {p.description && <p className="text-sm text-gray-500 line-clamp-2 mb-2">{p.description}</p>}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div>
                    {p.website && (
                      <a href={p.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium">
                        <ExternalLink className="h-3 w-3" /> Site web
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100"><Pencil className="h-3.5 w-3.5 text-gray-500" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showForm ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
            <Handshake className="h-8 w-8 text-purple-300" />
          </div>
          <p className="text-gray-500 font-medium">Aucun partenaire</p>
          <p className="text-sm text-gray-400 mt-1">Ajoutez des associations partenaires.</p>
        </div>
      ) : null}
    </div>
  );
}
