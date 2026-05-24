import Link from 'next/link';
import { Heart, Mail, Phone, Leaf, MapPin } from 'lucide-react';
import { serverApi } from '@/lib/api';

async function getFooterContent() {
  try {
    const res = await serverApi.get('/api/content');
    return res.data.data as Record<string, string>;
  } catch {
    return {} as Record<string, string>;
  }
}

export default async function Footer() {
  const c = await getFooterContent();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-emerald-100 bg-emerald-50/50 mt-16">
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg text-emerald-800 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <span>{c.footer_name || 'ANJS'}</span>
          </div>
          <p className="text-sm text-emerald-700/60 leading-relaxed">
            {c.footer_description || "Association Nova Jeunesse pour la Solidarité — des lycéens engagés qui aident les personnes démunies."}
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-emerald-800 mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm text-emerald-700/60">
            {[
              ['Accueil', '/'],
              ['À propos', '/a-propos'],
              ['Bénévoles', '/benevoles'],
              ['Demandes d\'aide', '/aides'],
              ['Événements', '/evenements'],
              ['Actualités', '/actualites'],
              ['Contact', '/contact'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-emerald-700 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-emerald-800 mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-emerald-700/60">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${c.footer_email || 'contact@anjs.org'}`} className="hover:text-emerald-700">
                {c.footer_email || 'contact@anjs.org'}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{c.footer_phone || '+235 XX XX XX XX'}</span>
            </li>
            {c.footer_address && (
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{c.footer_address}</span>
              </li>
            )}
          </ul>
          <Link
            href="/dons"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Heart className="h-4 w-4" />
            {c.footer_cta || 'Faire un don'}
          </Link>
        </div>
      </div>
      <div className="border-t border-emerald-100 py-4 text-center text-xs text-emerald-700/50">
        © {year} {c.footer_copyright || 'Association Nova Jeunesse pour la Solidarité. Tous droits réservés.'}
      </div>
    </footer>
  );
}
