'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';
import type { NewsArticle } from '@/lib/types';
import type { ContentMap } from '@/app/page';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';

export default function NewsSection({ articles, c }: { articles: NewsArticle[]; c: ContentMap }) {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="container mx-auto">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-3">{c.news_badge || 'Blog'}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">{c.news_title || 'Dernières actualités'}</h2>
              <p className="text-muted-foreground mt-2 text-lg">{c.news_subtitle || 'Suivez nos actions sur le terrain'}</p>
            </div>
            <Link href="/actualites" className="hidden md:block">
              <Button variant="ghost" className="gap-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
                Voir tout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <StaggerItem key={art.id}>
              <Link href={`/actualites/${art.slug}`}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md h-full group">
                    {art.coverImageUrl ? (
                      <div className="relative h-48 overflow-hidden">
                        <img src={art.coverImageUrl} alt={art.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-amber-200" />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <BookOpen className="h-3.5 w-3.5" />
                        {formatDate(art.publishedAt)}
                        {art.isFeatured && <Badge className="text-xs bg-amber-100 text-amber-800 border-0">A la une</Badge>}
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-700 transition-colors">{art.title}</h3>
                      {art.excerpt && <p className="text-sm text-muted-foreground leading-relaxed">{truncate(art.excerpt, 100)}</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
