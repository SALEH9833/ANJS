import { serverApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Event } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Événements' };

async function getData() {
  try {
    const res = await serverApi.get<{ data: Event[] }>('/api/events');
    return res.data.data;
  } catch {
    return [];
  }
}

export default async function EvenementsPage() {
  const events = await getData();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-3">Agenda</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos événements</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Participez à nos actions et rejoignez le mouvement solidaire.
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <Card key={evt.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {evt.imageUrl && (
                <img src={evt.imageUrl} alt={evt.title} className="w-full h-48 object-cover" />
              )}
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm text-primary font-medium mb-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(evt.startDate)}
                  {evt.endDate && <span> — {formatDate(evt.endDate)}</span>}
                </div>
                <h3 className="font-semibold text-lg mb-2">{evt.title}</h3>
                {evt.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {evt.location}
                  </div>
                )}
                {evt.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{evt.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun événement prévu pour le moment.</p>
        </div>
      )}
    </div>
  );
}
