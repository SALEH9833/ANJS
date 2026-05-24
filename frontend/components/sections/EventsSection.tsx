'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Event } from '@/lib/types';
import type { ContentMap } from '@/app/page';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';

export default function EventsSection({ events, c }: { events: Event[]; c: ContentMap }) {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <FadeIn>
          <div className="flex items-end justify-between mb-12">
            <div>
              <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-3">{c.events_badge || 'Agenda'}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">{c.events_title || 'Prochains événements'}</h2>
              <p className="text-muted-foreground mt-2 text-lg">{c.events_subtitle || 'Venez nous rejoindre'}</p>
            </div>
            <Link href="/evenements" className="hidden md:block">
              <Button variant="ghost" className="gap-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50">
                Voir tout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((evt) => (
            <StaggerItem key={evt.id}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md h-full">
                  {evt.imageUrl ? (
                    <div className="relative h-44 overflow-hidden">
                      <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-emerald-300" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-sm text-emerald-700 font-semibold mb-3">
                      <Calendar className="h-4 w-4" />
                      {formatDate(evt.startDate)}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{evt.title}</h3>
                    {evt.location && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {evt.location}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
