import { serverApi } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { NewsArticle } from '@/lib/types';
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await serverApi.get<{ data: NewsArticle }>(`/api/news/${slug}`);
    return { title: res.data.data.title, description: res.data.data.excerpt ?? '' };
  } catch {
    return { title: 'Article introuvable' };
  }
}

async function getArticle(slug: string) {
  try {
    const res = await serverApi.get<{ data: NewsArticle }>(`/api/news/${slug}`);
    return res.data.data;
  } catch {
    return null;
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link href="/actualites" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" />
        Retour aux actualités
      </Link>

      {article.coverImageUrl && (
        <img src={article.coverImageUrl} alt={article.title} className="w-full h-64 md:h-80 object-cover rounded-lg mb-6" />
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          {formatDate(article.publishedAt)}
        </div>
        {article.isFeatured && <Badge variant="secondary">À la une</Badge>}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
      {article.excerpt && (
        <p className="text-lg text-muted-foreground mb-8">{article.excerpt}</p>
      )}

      <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: article.content ?? '' }} />
    </div>
  );
}
