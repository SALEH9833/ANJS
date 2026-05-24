'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, Upload, Trash2, Copy, Check, Loader2, X } from 'lucide-react';
import api from '@/lib/api';
import type { MediaAsset } from '@/lib/types';

function formatSize(bytes: number | null) {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' o';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' Ko';
  return (bytes / 1048576).toFixed(1) + ' Mo';
}

export default function AdminMediasPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [preview, setPreview] = useState<MediaAsset | null>(null);
  const [filter, setFilter] = useState('');

  const fetchData = () => { api.get('/api/media').then(r => setAssets(r.data.data)).catch(() => {}); };
  useEffect(() => { fetchData(); }, []);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('category', 'GENERAL');
      try { await api.post('/api/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }); }
      catch { alert(`Erreur upload: ${files[i].name}`); }
    }
    setUploading(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce fichier ?')) return;
    await api.delete(`/api/media/${id}`);
    if (preview?.id === id) setPreview(null);
    fetchData();
  };

  const copyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.url);
    setCopied(asset.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = filter ? assets.filter(a => a.category === filter) : assets;
  const categories = Array.from(new Set(assets.map(a => a.category)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">{assets.length} fichier(s)</p>
          {categories.length > 1 && (
            <div className="flex gap-1">
              <button onClick={() => setFilter('')} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${!filter ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}>Tous</button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${filter === cat ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:bg-gray-100'}`}>{cat}</button>
              ))}
            </div>
          )}
        </div>
        <label className="cursor-pointer">
          <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm pointer-events-none" disabled={uploading}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Upload...' : 'Uploader'}
          </Button>
          <input type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && handleUpload(e.target.files)} />
        </label>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((asset) => (
            <Card key={asset.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow group cursor-pointer" onClick={() => setPreview(asset)}>
              <div className="aspect-square relative bg-gray-100">
                <img src={asset.url} alt={asset.altText || asset.filename} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                    <button onClick={() => copyUrl(asset)} className="p-2 bg-white rounded-lg shadow-md hover:bg-emerald-50">
                      {copied === asset.id ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-gray-600" />}
                    </button>
                    <button onClick={() => handleDelete(asset.id)} className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50">
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
              <CardContent className="p-2.5">
                <p className="text-xs text-gray-600 truncate font-medium">{asset.filename}</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[10px] text-gray-400">{formatSize(asset.sizeBytes)}</span>
                  <Badge className="text-[9px] px-1.5 py-0 bg-gray-100 text-gray-500 border-0">{asset.category}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4"><ImageIcon className="h-8 w-8 text-emerald-300" /></div>
          <p className="text-gray-500 font-medium">Aucun fichier</p>
          <p className="text-sm text-gray-400 mt-1">Uploadez des images pour les utiliser sur le site.</p>
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">{preview.filename}</h3>
              <button onClick={() => setPreview(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="bg-gray-100 flex items-center justify-center" style={{ maxHeight: '60vh' }}>
              <img src={preview.url} alt={preview.altText || preview.filename} className="max-w-full max-h-[60vh] object-contain" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {formatSize(preview.sizeBytes)} · {preview.category} · {new Date(preview.createdAt).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyUrl(preview)} className="gap-1">
                  {copied === preview.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied === preview.id ? 'Copié' : 'Copier URL'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(preview.id)} className="gap-1 text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
