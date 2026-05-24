'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HandHeart, Users, GraduationCap } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';
import type { ContentMap } from '@/app/page';

const icons = [
  { icon: HandHeart, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { icon: Users, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  { icon: GraduationCap, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
];

export default function MissionSection({ c }: { c: ContentMap }) {
  const missions = [
    { title: c.mission_1_title || 'Aide directe', desc: c.mission_1_desc || '', image: c.mission_1_image || '' },
    { title: c.mission_2_title || 'Réseau solidaire', desc: c.mission_2_desc || '', image: c.mission_2_image || '' },
    { title: c.mission_3_title || 'Jeunesse engagée', desc: c.mission_3_desc || '', image: c.mission_3_image || '' },
  ];

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        <FadeIn className="text-center mb-16">
          <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-4 text-sm px-4 py-1">{c.mission_badge || 'Notre mission'}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.mission_title || 'Ce que nous faisons'}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {c.mission_subtitle || 'Nous agissons sur le terrain pour améliorer la vie des plus vulnérables.'}
          </p>
        </FadeIn>
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
          {missions.map((m, i) => (
            <StaggerItem key={m.title}>
              <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <Card className="overflow-hidden border-0 shadow-lg shadow-emerald-900/5 hover:shadow-xl hover:shadow-emerald-900/10 transition-shadow duration-500 h-full">
                  <div className="relative h-52 overflow-hidden">
                    {m.image && (
                      <Image src={m.image} alt={m.title} fill className="object-cover transition-transform duration-700 hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <CardContent className="p-6 relative">
                    <div className={`w-14 h-14 rounded-xl ${icons[i].iconBg} flex items-center justify-center -mt-12 relative z-10 shadow-lg border-4 border-white`}>
                      {(() => { const Icon = icons[i].icon; return <Icon className={`h-6 w-6 ${icons[i].iconColor}`} />; })()}
                    </div>
                    <h3 className="font-bold text-xl mt-4 mb-2">{m.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{m.desc}</p>
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
