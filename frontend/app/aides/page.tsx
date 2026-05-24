import { serverApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HandHeart } from 'lucide-react';
import { urgencyColor, urgencyLabel, categoryLabel, truncate, formatDate } from '@/lib/utils';
import type { AidRequest } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Demandes d\'aide' };

async function getData() {
  try {
    const res = await serverApi.get<{ data: AidRequest[] }>('/api/aid-requests');
    return res.data.data;
  } catch {
    return [];
  }
}

export default async function AidesPage() {
  const requests = await getData();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-3">Solidarité</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Demandes d&apos;aide</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Ces familles ont besoin de votre soutien. Chaque contribution fait la différence.
        </p>
      </div>

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <Card key={req.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {req.imageUrl && (
                <img src={req.imageUrl} alt={req.title} className="w-full h-48 object-cover" />
              )}
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">{categoryLabel(req.category)}</Badge>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyColor(req.urgency)}`}>
                    {urgencyLabel(req.urgency)}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{req.title}</h3>
                {req.description && (
                  <p className="text-sm text-muted-foreground mb-3">{truncate(req.description, 150)}</p>
                )}
                <p className="text-xs text-muted-foreground">{formatDate(req.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <HandHeart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucune demande d&apos;aide pour le moment.</p>
        </div>
      )}
    </div>
  );
}
