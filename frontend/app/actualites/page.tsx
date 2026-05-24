import Link from 'next/link';
import { serverApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';
import type { NewsArticle } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Actualités' };

async function getData() {
  try {
    const res = await serverApi.get<{ data: NewsArticle[] }>('/api/news');
    return res.data.data;
  } catch {
    return [];
  }
}

export default async function ActualitesPage() {
  const articles = await getData();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-3">Blog</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Actualités</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Suivez nos actions, projets et réussites au quotidien.
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <Link key={art.id} href={`/actualites/${art.slug}`}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow h-full">
                {art.coverImageUrl && (
                  <img src={art.coverImageUrl} alt={art.title} className="w-full h-48 object-cover" />
                )}
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <BookOpen className="h-4 w-4" />
                    {formatDate(art.publishedAt)}
                    {art.isFeatured && <Badge variant="secondary" className="text-xs">À la une</Badge>}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{art.title}</h3>
                  {art.excerpt && (
                    <p className="text-sm text-muted-foreground">{truncate(art.excerpt, 150)}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun article publié pour le moment.</p>
        </div>
      )}
    </div>
  );
}
