import { serverApi } from '@/lib/api';
import type { Member } from '@/lib/types';
import type { ContentMap } from '@/app/page';
import AboutClient from './AboutClient';

async function getData() {
  try {
    const [membersRes, contentRes] = await Promise.allSettled([
      serverApi.get<{ data: Member[] }>('/api/members'),
      serverApi.get<{ data: ContentMap }>('/api/content'),
    ]);
    return {
      members: membersRes.status === 'fulfilled' ? membersRes.value.data.data : [],
      content: contentRes.status === 'fulfilled' ? contentRes.value.data.data : {},
    };
  } catch {
    return { members: [], content: {} };
  }
}

export const metadata = {
  title: 'À propos',
  description: "Découvrez l'histoire et les fondements de l'Association Nova Jeunesse pour la Solidarité.",
};

export default async function AProposPage() {
  const { members, content } = await getData();
  return <AboutClient members={members} c={content} />;
}
