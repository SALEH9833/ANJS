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
import type { Member } from '@/lib/types';

const emptyForm = {
  firstName: '', lastName: '', role: '', email: '', phone: '', bio: '', photoUrl: null as string | null, order: 0, isActive: true,
};

export default function AdminMembresPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchMembers = () => {
    api.get('/api/members/all').then(res => setMembers(res.data.data)).catch(() => {});
  };

  useEffect(() => { fetchMembers(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, email: form.email || null, phone: form.phone || null, bio: form.bio || null };
    try {
      if (editing) {
        await api.put(`/api/members/${editing}`, payload);
      } else {
        await api.post('/api/members', payload);
      }
      fetchMembers();
      resetForm();
    } catch { alert('Erreur lors de l\'enregistrement'); }
    setLoading(false);
  };

  const handleEdit = (m: Member) => {
    setForm({ firstName: m.firstName, lastName: m.lastName, role: m.role, email: m.email || '', phone: m.phone || '', bio: m.bio || '', photoUrl: m.photoUrl, order: m.order, isActive: m.isActive });
    setEditing(m.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce membre ?')) return;
    await api.delete(`/api/members/${id}`);
    fetchMembers();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{members.length} membre(s) au total</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm">
            <Plus className="h-4 w-4" /> Ajouter un membre
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">{editing ? 'Modifier le membre' : 'Nouveau membre'}</CardTitle>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
              <X className="h-5 w-5" />
            </button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Prénom *</Label>
                  <Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Nom *</Label>
                  <Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Rôle *</Label>
                  <Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Ex: Président, Secrétaire..." required className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Ordre d&apos;affichage</Label>
                  <Input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className="h-10" />
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
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} id="isActive" className="rounded" />
                <Label htmlFor="isActive" className="text-sm text-gray-600">Membre actif</Label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 px-6">
                  {loading ? 'Enregistrement...' : (editing ? 'Mettre à jour' : 'Créer le membre')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((m) => (
            <Card key={m.id} className={`overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow group ${!m.isActive ? 'opacity-50' : ''}`}>
              <div className="aspect-[4/3] relative bg-gradient-to-br from-emerald-50 to-emerald-100">
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt={`${m.firstName} ${m.lastName}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="h-12 w-12 text-emerald-200" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(m)} className="p-1.5 bg-white rounded-lg shadow-md hover:bg-emerald-50 transition-colors">
                    <Pencil className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} className="p-1.5 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors">
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </button>
                </div>
                {!m.isActive && (
                  <Badge className="absolute top-2 left-2 bg-gray-800/80 text-white border-0 text-[10px]">Inactif</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900">{m.firstName} {m.lastName}</h3>
                <p className="text-sm text-emerald-600 font-medium">{m.role}</p>
                {m.email && <p className="text-xs text-gray-400 mt-1">{m.email}</p>}
                {m.phone && <p className="text-xs text-gray-400">{m.phone}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showForm ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-emerald-300" />
          </div>
          <p className="text-gray-500 font-medium">Aucun membre ajouté</p>
          <p className="text-sm text-gray-400 mt-1">Cliquez sur &quot;Ajouter un membre&quot; pour commencer.</p>
        </div>
      ) : null}
    </div>
  );
}
