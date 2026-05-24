'use client';

import { useEffect, useState, useCallback } from 'react';
import { Save, Loader2, Check, Type, Image as ImageIcon, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ImageUpload from '@/components/admin/ImageUpload';
import api from '@/lib/api';

interface ContentItem {
  id: string;
  key: string;
  value: string;
  type: string;
  group: string;
  label: string;
}

const GROUP_LABELS: Record<string, string> = {
  hero: 'Accueil — Hero',
  stats: 'Accueil — Statistiques',
  mission: 'Accueil — Missions',
  aid: 'Accueil — Demandes d\'aide',
  events: 'Accueil — Événements',
  news: 'Accueil — Actualités',
  cta: 'Accueil — Appel à l\'action',
  about: 'À propos — En-tête',
  about_history: 'À propos — Histoire',
  about_values: 'À propos — Valeurs',
  about_quote: 'À propos — Citation',
  footer: 'Pied de page',
};

const GROUP_ORDER = ['hero', 'stats', 'mission', 'aid', 'events', 'news', 'cta', 'about', 'about_history', 'about_values', 'about_quote', 'footer'];

export default function AdminContenuPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [modified, setModified] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string>('hero');

  const fetchContent = useCallback(async () => {
    try {
      const res = await api.get('/api/content/all');
      setItems(res.data.data);
    } catch {
      alert('Erreur lors du chargement du contenu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContent(); }, [fetchContent]);

  const handleChange = (key: string, value: string) => {
    setModified((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const getValue = (item: ContentItem) => {
    return modified[item.key] !== undefined ? modified[item.key] : item.value;
  };

  const handleSave = async () => {
    if (Object.keys(modified).length === 0) return;
    setSaving(true);
    try {
      const items_to_save = Object.entries(modified).map(([key, value]) => ({ key, value }));
      await api.put('/api/content', { items: items_to_save });
      setItems((prev) =>
        prev.map((item) =>
          modified[item.key] !== undefined ? { ...item, value: modified[item.key] } : item
        )
      );
      setModified({});
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const grouped = GROUP_ORDER.reduce<Record<string, ContentItem[]>>((acc, group) => {
    acc[group] = items.filter((item) => item.group === group);
    return acc;
  }, {});

  const ungrouped = items.filter((item) => !GROUP_ORDER.includes(item.group));
  if (ungrouped.length > 0) grouped['other'] = ungrouped;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  const modifiedCount = Object.keys(modified).length;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-56 shrink-0 border-r border-gray-200 bg-white overflow-y-auto py-4 px-2 hidden md:block">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Sections</p>
        {GROUP_ORDER.map((group) => {
          const count = grouped[group]?.length || 0;
          if (count === 0) return null;
          const hasModified = grouped[group]?.some((item) => modified[item.key] !== undefined);
          return (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-0.5 flex items-center justify-between ${
                activeGroup === group
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="truncate">{GROUP_LABELS[group] || group}</span>
              {hasModified && <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-gray-800">{GROUP_LABELS[activeGroup] || activeGroup}</h2>
            {modifiedCount > 0 && (
              <Badge className="bg-amber-100 text-amber-800 border-0">
                {modifiedCount} modification{modifiedCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={modifiedCount === 0 || saving}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saved ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saved ? 'Sauvegardé' : 'Sauvegarder'}
          </Button>
        </div>

        <div className="p-6 space-y-4 max-w-4xl">
          <div className="md:hidden mb-4">
            <select
              value={activeGroup}
              onChange={(e) => setActiveGroup(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {GROUP_ORDER.map((group) => (
                <option key={group} value={group}>{GROUP_LABELS[group] || group}</option>
              ))}
            </select>
          </div>

          {(grouped[activeGroup] || []).map((item) => (
            <Card key={item.key} className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    {item.type === 'image' ? (
                      <ImageIcon className="h-4 w-4 text-gray-500" />
                    ) : item.type === 'number' ? (
                      <Hash className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Type className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{item.key}</span>
                      {modified[item.key] !== undefined && (
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </div>
                    {item.type === 'image' ? (
                      <ImageUpload
                        value={getValue(item) || null}
                        onChange={(url) => handleChange(item.key, url || '')}
                        category="CONTENT"
                      />
                    ) : item.type === 'textarea' ? (
                      <Textarea
                        value={getValue(item)}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        rows={3}
                        className="text-sm"
                      />
                    ) : (
                      <Input
                        value={getValue(item)}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        type={item.type === 'number' ? 'number' : 'text'}
                        className="text-sm"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {(grouped[activeGroup] || []).length === 0 && (
            <div className="text-center py-16 text-gray-400">
              Aucun contenu dans cette section.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
