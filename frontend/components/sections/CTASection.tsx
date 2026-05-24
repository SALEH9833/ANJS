'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import type { ContentMap } from '@/app/page';

export default function CTASection({ c }: { c: ContentMap }) {
  return (
    <section className="relative py-32 px-4 text-white text-center overflow-hidden">
      <Image
        src={c.cta_image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&h=600&fit=crop'}
        alt="Solidarité"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/85" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      <div className="container mx-auto max-w-3xl relative z-10">
        <FadeIn>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/20"
          >
            <Heart className="h-9 w-9 fill-white/30" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            {c.cta_title_1 || 'Chaque geste'}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-emerald-200">
              {c.cta_title_highlight || 'compte'}
            </span>
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-xl mx-auto drop-shadow">
            {c.cta_description || "Votre don, aussi petit soit-il, change une vie. Soutenez notre association et aidez-nous à construire un avenir meilleur."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dons">
              <Button size="lg" className="gap-2 bg-white text-emerald-900 hover:bg-amber-50 shadow-2xl shadow-white/20 px-10 h-14 text-base font-semibold rounded-xl">
                <Heart className="h-5 w-5" />
                {c.cta_btn_primary || 'Faire un don maintenant'}
              </Button>
            </Link>
            <Link href="/benevoles">
              <Button size="lg" className="gap-2 bg-amber-400 text-emerald-950 hover:bg-amber-300 shadow-lg shadow-amber-500/30 px-10 h-14 text-base font-semibold rounded-xl">
                {c.cta_btn_secondary || 'Devenir bénévole'} <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
