import { serverApi } from '@/lib/api';
import type { AidRequest, Event, NewsArticle, DonationStats } from '@/lib/types';
import HeroSection from '@/components/sections/HeroSection';
import StatsBar from '@/components/sections/StatsBar';
import MissionSection from '@/components/sections/MissionSection';
import CTASection from '@/components/sections/CTASection';
import AidRequestsSection from '@/components/sections/AidRequestsSection';
import EventsSection from '@/components/sections/EventsSection';
import NewsSection from '@/components/sections/NewsSection';

export type ContentMap = Record<string, string>;

async function getData() {
  try {
    const [aidRes, eventsRes, newsRes, statsRes, contentRes] = await Promise.allSettled([
      serverApi.get<{ data: AidRequest[] }>('/api/aid-requests?status=PENDING'),
      serverApi.get<{ data: Event[] }>('/api/events?upcoming=true'),
      serverApi.get<{ data: NewsArticle[] }>('/api/news?limit=3'),
      serverApi.get<{ data: DonationStats }>('/api/donations/stats'),
      serverApi.get<{ data: ContentMap }>('/api/content'),
    ]);
    return {
      aidRequests: aidRes.status === 'fulfilled' ? aidRes.value.data.data.slice(0, 3) : [],
      events: eventsRes.status === 'fulfilled' ? eventsRes.value.data.data.slice(0, 3) : [],
      articles: newsRes.status === 'fulfilled' ? newsRes.value.data.data : [],
      stats: statsRes.status === 'fulfilled' ? statsRes.value.data.data : null,
      content: contentRes.status === 'fulfilled' ? contentRes.value.data.data : {},
    };
  } catch {
    return { aidRequests: [], events: [], articles: [], stats: null, content: {} };
  }
}

export default async function HomePage() {
  const { aidRequests, events, articles, stats, content } = await getData();

  return (
    <div className="overflow-hidden">
      <HeroSection stats={stats} c={content} />
      <StatsBar stats={stats} c={content} />
      <MissionSection c={content} />
      {aidRequests.length > 0 && <AidRequestsSection aidRequests={aidRequests} c={content} />}
      {events.length > 0 && <EventsSection events={events} c={content} />}
      {articles.length > 0 && <NewsSection articles={articles} c={content} />}
      <CTASection c={content} />
    </div>
  );
}
