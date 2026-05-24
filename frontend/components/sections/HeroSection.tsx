'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Users, Leaf, Sparkles } from 'lucide-react';
import type { DonationStats } from '@/lib/types';
import type { ContentMap } from '@/app/page';

export default function HeroSection({ stats, c }: { stats: DonationStats | null; c: ContentMap }) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={c.hero_image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&h=1080&fit=crop&q=80'}
          alt="Solidarité"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/90 via-emerald-900/70 to-emerald-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
              <Sparkles className="h-4 w-4 text-amber-300" />
              {c.hero_badge || 'Association de lycéens engagés'}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1] drop-shadow-lg"
          >
            {c.hero_title_1 || 'Ensemble,'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-200">
              {c.hero_title_highlight || 'aidons'}
            </span>{' '}
            {c.hero_title_2 || 'ceux qui en ont besoin'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-xl drop-shadow"
          >
            {c.hero_description || "L'ANJS regroupe des élèves de Terminale qui s'engagent pour aider les personnes démunies en collaboration avec des écoles et associations partenaires."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/dons">
              <Button size="lg" className="gap-2 bg-white text-emerald-900 hover:bg-amber-50 shadow-2xl shadow-white/20 px-8 h-14 text-base font-semibold rounded-xl">
                <Heart className="h-5 w-5" />
                {c.hero_btn_primary || 'Faire un don'}
              </Button>
            </Link>
            <Link href="/a-propos">
              <Button size="lg" className="gap-2 bg-amber-400 text-emerald-950 hover:bg-amber-300 shadow-lg shadow-amber-500/30 px-8 h-14 text-base font-semibold rounded-xl">
                <Users className="h-5 w-5" />
                {c.hero_btn_secondary || "Découvrir l'ANJS"}
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-8 right-8 hidden lg:flex items-center gap-6"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Heart className="h-6 w-6 text-emerald-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats?.totalDonors ?? 0}+</p>
                <p className="text-sm text-white/60">{c.hero_stat_label || 'Donateurs'}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Leaf className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{c.hero_volunteer_label || '100% Bénévoles'}</p>
                <p className="text-sm text-white/60">de l&apos;équipe</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
