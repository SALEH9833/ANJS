'use client';

import { HandHeart, Heart, Users, GraduationCap } from 'lucide-react';
import Counter from '@/components/animations/Counter';
import FadeIn from '@/components/animations/FadeIn';
import type { DonationStats } from '@/lib/types';
import type { ContentMap } from '@/app/page';

export default function StatsBar({ stats, c }: { stats: DonationStats | null; c: ContentMap }) {
  return (
    <section className="py-16 bg-emerald-800 relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div className="group cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                <HandHeart className="h-7 w-7 opacity-90" />
              </div>
              <div className="text-3xl md:text-4xl font-bold">
                <Counter target={stats?.totalDonors ?? 0} suffix="+" />
              </div>
              <div className="text-sm opacity-60 mt-1 font-medium">{c.stats_label_1 || 'Donateurs'}</div>
            </div>
            <div className="group cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                <Heart className="h-7 w-7 opacity-90" />
              </div>
              <div className="text-3xl md:text-4xl font-bold">
                <Counter target={stats ? Math.round(Number(stats.totalAmount)) : 0} />
              </div>
              <div className="text-sm opacity-60 mt-1 font-medium">{c.stats_label_2 || 'FCFA collectés'}</div>
            </div>
            <div className="group cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                <Users className="h-7 w-7 opacity-90" />
              </div>
              <div className="text-3xl md:text-4xl font-bold">{c.stats_value_3 || '100%'}</div>
              <div className="text-sm opacity-60 mt-1 font-medium">{c.stats_label_3 || 'Bénévoles'}</div>
            </div>
            <div className="group cursor-default">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                <GraduationCap className="h-7 w-7 opacity-90" />
              </div>
              <div className="text-3xl md:text-4xl font-bold">{c.stats_value_4 || 'ANJS'}</div>
              <div className="text-sm opacity-60 mt-1 font-medium">{c.stats_label_4 || 'Terminales solidaires'}</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
