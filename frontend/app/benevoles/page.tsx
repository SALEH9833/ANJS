import { serverApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap } from 'lucide-react';
import type { Volunteer, School } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nos bénévoles' };

async function getData() {
  try {
    const [volRes, schoolRes] = await Promise.allSettled([
      serverApi.get<{ data: Volunteer[] }>('/api/volunteers'),
      serverApi.get<{ data: School[] }>('/api/schools'),
    ]);
    return {
      volunteers: volRes.status === 'fulfilled' ? volRes.value.data.data : [],
      schools: schoolRes.status === 'fulfilled' ? schoolRes.value.data.data : [],
    };
  } catch {
    return { volunteers: [], schools: [] };
  }
}

export default async function BenevolesPage() {
  const { volunteers, schools } = await getData();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <Badge variant="secondary" className="mb-3">Notre équipe</Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Nos bénévoles</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Des lycéens engagés qui donnent de leur temps pour aider les personnes démunies.
        </p>
      </div>

      {volunteers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {volunteers.map((v) => (
            <Card key={v.id} className="text-center overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {v.photoUrl ? (
                    <img src={v.photoUrl} alt={`${v.firstName} ${v.lastName}`} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="h-8 w-8 text-primary" />
                  )}
                </div>
                <h3 className="font-semibold">{v.firstName} {v.lastName}</h3>
                {v.school && (
                  <p className="text-sm text-muted-foreground mt-1">{v.school.name}</p>
                )}
                {v.bio && <p className="text-sm text-muted-foreground mt-2">{v.bio}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Les bénévoles seront bientôt affichés ici.</p>
        </div>
      )}

      {schools.length > 0 && (
        <div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Écoles partenaires</h2>
            <p className="text-muted-foreground">Les établissements qui soutiennent notre action</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {schools.map((s) => (
              <Card key={s.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {s.coverImageUrl ? (
                  <img src={s.coverImageUrl} alt={s.name} className="w-full h-36 object-cover" />
                ) : (
                  <div className="w-full h-36 bg-indigo-50 flex items-center justify-center">
                    <GraduationCap className="h-10 w-10 text-indigo-200" />
                  </div>
                )}
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {s.logoUrl ? (
                      <img src={s.logoUrl} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <GraduationCap className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{s.name}</h3>
                    {s.city && <p className="text-sm text-muted-foreground">{s.city}</p>}
                    {s._count && (
                      <p className="text-xs text-emerald-600 mt-0.5">{s._count.volunteers} bénévole(s)</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
