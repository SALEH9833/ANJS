'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, BookOpen, X, Star } from 'lucide-react';
import api from '@/lib/api';
import ImageUpload from '@/components/admin/ImageUpload';

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
  status: string;
}

const emptyForm = {
  title: '', slug: '', excerpt: '', content: '', coverImageUrl: null as string | null, isFeatured: false, status: 'DRAFT',
};

function toSlug(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminArticlesPage() {
  const [items, setItems] = useState<Article[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchData = () => { api.get('/api/news/all').then(r => setItems(r.data.data)).catch(() => {}); };
  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditing(null); setShowForm(false); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...form,
      slug: form.slug || toSlug(form.title),
      excerpt: form.excerpt || null,
      content: form.content || null,
      publishedAt: form.status === 'PUBLISHED' ? new Date().toISOString() : null,
    };
    try {
      if (editing) { await api.put(`/api/news/${editing}`, payload); }
      else { await api.post('/api/news', payload); }
      fetchData();
      resetForm();
    } catch { alert('Erreur lors de l\'enregistrement'); }
    setLoading(false);
  };

  const handleEdit = (a: Article) => {
    setForm({ title: a.title, slug: a.slug, excerpt: a.excerpt || '', content: a.content || '', coverImageUrl: a.coverImageUrl, isFeatured: a.isFeatured, status: a.status });
    setEditing(a.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet article ?')) return;
    await api.delete(`/api/news/${id}`);
    fetchData();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} article(s)</p>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm">
            <Plus className="h-4 w-4" /> Nouvel article
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">{editing ? 'Modifier l\'article' : 'Nouvel article'}</CardTitle>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="h-5 w-5" /></button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Titre *</Label>
                  <Input value={form.title} onChange={e => { setForm({ ...form, title: e.target.value, slug: editing ? form.slug : toSlug(e.target.value) }); }} required />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Slug</Label>
                  <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="genere-automatiquement" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-gray-700">Statut</Label>
                  <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option value="DRAFT">Brouillon</option>
                    <option value="PUBLISHED">Publié</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Extrait</Label>
                <Textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Court résumé de l'article..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Contenu</Label>
                <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} placeholder="Contenu complet de l'article..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium text-gray-700">Image de couverture</Label>
                <ImageUpload value={form.coverImageUrl} onChange={(url) => setForm({ ...form, coverImageUrl: url })} category="NEWS" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} id="isFeatured" className="rounded" />
                <Label htmlFor="isFeatured" className="text-sm text-gray-600">Article à la une</Label>
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
          {items.map((a) => (
            <Card key={a.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-40 relative bg-gradient-to-br from-amber-50 to-orange-50">
                {a.coverImageUrl ? (
                  <img src={a.coverImageUrl} alt={a.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><BookOpen className="h-12 w-12 text-amber-200" /></div>
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(a)} className="p-1.5 bg-white rounded-lg shadow-md hover:bg-emerald-50"><Pencil className="h-3.5 w-3.5 text-gray-600" /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 bg-white rounded-lg shadow-md hover:bg-red-50"><Trash2 className="h-3.5 w-3.5 text-red-500" /></button>
                </div>
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge className={`border-0 text-[10px] ${a.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {a.status === 'PUBLISHED' ? 'Publié' : 'Brouillon'}
                  </Badge>
                  {a.isFeatured && <Badge className="border-0 text-[10px] bg-amber-100 text-amber-800"><Star className="h-2.5 w-2.5 mr-0.5" />Une</Badge>}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{a.title}</h3>
                {a.excerpt && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{a.excerpt}</p>}
                {a.publishedAt && <p className="text-xs text-emerald-600 mt-2">{new Date(a.publishedAt).toLocaleDateString('fr-FR')}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !showForm ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4"><BookOpen className="h-8 w-8 text-emerald-300" /></div>
          <p className="text-gray-500 font-medium">Aucun article</p>
        </div>
      ) : null}
    </div>
  );
}
