'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Users, Leaf, Target, Mail, Phone, Quote } from 'lucide-react';
import type { Member } from '@/lib/types';
import type { ContentMap } from '@/app/page';
import FadeIn from '@/components/animations/FadeIn';
import StaggerChildren, { StaggerItem } from '@/components/animations/StaggerChildren';

export default function AboutClient({ members, c }: { members: Member[]; c: ContentMap }) {
  const values = [
    { icon: Heart, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', title: c.about_value_1_title || 'Solidarité', desc: c.about_value_1_desc || '' },
    { icon: Users, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', title: c.about_value_2_title || 'Collaboration', desc: c.about_value_2_desc || '' },
    { icon: Target, iconBg: 'bg-green-100', iconColor: 'text-green-600', title: c.about_value_3_title || 'Engagement', desc: c.about_value_3_desc || '' },
  ];

  return (
    <div className="overflow-hidden">
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={c.about_hero_image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=600&fit=crop'}
            alt="Jeunes solidaires"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/75 to-emerald-800/60" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="bg-white/15 text-white border-0 mb-5 backdrop-blur-sm text-sm px-4 py-1.5">{c.about_hero_badge || 'Notre histoire'}</Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold mb-5 tracking-tight drop-shadow-lg"
          >
            {c.about_hero_title || "À propos de l'"}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-200">{c.about_hero_highlight || 'ANJS'}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            {c.about_hero_desc || 'Une association fondée par des lycéens déterminés à faire la différence.'}
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <FadeIn direction="left">
              <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-5 text-sm px-4 py-1">Fondement</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-emerald-950 tracking-tight">
                {c.about_history_title || 'Notre'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
                  {c.about_history_highlight || 'histoire'}
                </span>
              </h2>
              <div className="space-y-5 text-emerald-800/70 leading-relaxed text-base">
                <p>{c.about_history_p1 || ''}</p>
                <p>{c.about_history_p2 || ''}</p>
                <p>{c.about_history_p3 || ''}</p>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-200/30 to-amber-200/30 rounded-3xl blur-2xl" />
                <Image
                  src={c.about_history_image || 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&h=500&fit=crop'}
                  alt="Fondateurs ANJS"
                  width={600}
                  height={500}
                  className="relative rounded-2xl shadow-2xl w-full h-[420px] object-cover"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-emerald-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Leaf className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900">100% Bénévole</p>
                      <p className="text-xs text-emerald-600/60">Aucun salarié</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-b from-emerald-50/60 to-white">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="text-center mb-14">
            <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-4 text-sm px-4 py-1">Nos valeurs</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Ce qui nous{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-500">guide</span>
            </h2>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
                  <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl ${v.iconBg} flex items-center justify-center mx-auto mb-5`}>
                        <v.icon className={`h-8 w-8 ${v.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-xl mb-3">{v.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
            <div className="relative bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-3xl p-10 md:p-14 text-center text-white overflow-hidden">
              <div className="absolute top-4 left-6 opacity-20">
                <Quote className="h-20 w-20" />
              </div>
              <p className="text-xl md:text-2xl font-medium leading-relaxed italic relative z-10">
                &laquo; {c.about_quote || "La solidarité n'a pas d'âge. Quand la jeunesse s'engage, c'est tout un avenir qui change."} &raquo;
              </p>
              <p className="mt-6 text-emerald-300 font-semibold">— {c.about_quote_author || "L'équipe ANJS"}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      <section id="membres" className="py-24 px-4 scroll-mt-20">
        <div className="container mx-auto">
          <FadeIn className="text-center mb-14">
            <Badge className="bg-emerald-100 text-emerald-800 border-0 mb-4 text-sm px-4 py-1">L&apos;équipe</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Nos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">membres</span>
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">Les personnes qui font vivre l&apos;association au quotidien.</p>
          </FadeIn>
          {members.length > 0 ? (
            <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" staggerDelay={0.1}>
              {members.map((member) => (
                <StaggerItem key={member.id}>
                  <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.3 }}>
                    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="aspect-square relative bg-gradient-to-br from-emerald-100 to-emerald-50 overflow-hidden">
                        {member.photoUrl ? (
                          <img src={member.photoUrl} alt={`${member.firstName} ${member.lastName}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Users className="h-16 w-16 text-emerald-300" /></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-5 text-center">
                        <h3 className="font-bold text-lg">{member.firstName} {member.lastName}</h3>
                        <p className="text-sm text-emerald-600 font-semibold mt-0.5">{member.role}</p>
                        {member.bio && <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">{member.bio}</p>}
                        <div className="flex items-center justify-center gap-3 mt-4">
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 hover:scale-110 transition-all">
                              <Mail className="h-3.5 w-3.5" />
                            </a>
                          )}
                          {member.phone && (
                            <a href={`tel:${member.phone}`} className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 hover:scale-110 transition-all">
                              <Phone className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : (
            <FadeIn className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <Users className="h-12 w-12 text-emerald-300" />
              </div>
              <p className="text-lg text-muted-foreground">Les membres seront bientôt ajoutés.</p>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
}
