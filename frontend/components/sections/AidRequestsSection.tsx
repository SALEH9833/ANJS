'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, HandHeart } from 'lucide-react';
import { urgencyColor, urgencyLabel, categoryLabel, truncate } from '@/lib/utils';
import type { AidRequest } from '@/lib/types';
import type { ContentMap } from '@/app/page';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';

export default function AidRequestsSection({ aidRequests, c }: { aidRequests: AidRequest[]; c: ContentMap }) {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-amber-50/50 to-white">
      <div className="container mx-auto">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge className="bg-amber-100 text-amber-800 border-0 mb-3">{c.aid_badge || 'Urgences'}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">{c.aid_title || "Demandes d'aide"}</h2>
              <p className="text-muted-foreground mt-2 text-lg">{c.aid_subtitle || 'Ces familles ont besoin de votre soutien'}</p>
            </div>
            <Link href="/aides" className="hidden md:block">
              <Button variant="ghost" className="gap-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
                Voir tout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aidRequests.map((req) => (
            <StaggerItem key={req.id}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md h-full">
                  {req.imageUrl ? (
                    <div className="relative h-44 overflow-hidden">
                      <img src={req.imageUrl} alt={req.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center">
                      <HandHeart className="h-12 w-12 text-amber-300" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs border-emerald-200 bg-emerald-50">{categoryLabel(req.category)}</Badge>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${urgencyColor(req.urgency)}`}>
                        {urgencyLabel(req.urgency)}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{req.title}</h3>
                    {req.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{truncate(req.description, 100)}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
        <Link href="/aides" className="md:hidden mt-6 block">
          <Button variant="outline" className="w-full gap-2 text-emerald-700">
            Voir toutes les demandes <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
