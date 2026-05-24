import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CONTENT = [
  { key: 'hero_badge', value: 'Association de lycéens engagés', type: 'text', group: 'hero', label: 'Hero — Badge' },
  { key: 'hero_title_1', value: 'Ensemble,', type: 'text', group: 'hero', label: 'Hero — Titre ligne 1' },
  { key: 'hero_title_highlight', value: 'aidons', type: 'text', group: 'hero', label: 'Hero — Mot en surbrillance' },
  { key: 'hero_title_2', value: 'ceux qui en ont besoin', type: 'text', group: 'hero', label: 'Hero — Titre ligne 2' },
  { key: 'hero_description', value: "L'ANJS regroupe des élèves de Terminale qui s'engagent pour aider les personnes démunies en collaboration avec des écoles et associations partenaires.", type: 'text', group: 'hero', label: 'Hero — Description' },
  { key: 'hero_btn_primary', value: 'Faire un don', type: 'text', group: 'hero', label: 'Hero — Bouton principal' },
  { key: 'hero_btn_secondary', value: "Découvrir l'ANJS", type: 'text', group: 'hero', label: 'Hero — Bouton secondaire' },
  { key: 'hero_image', value: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&h=1080&fit=crop&q=80', type: 'image', group: 'hero', label: 'Hero — Image de fond' },
  { key: 'hero_stat_label', value: 'Donateurs', type: 'text', group: 'hero', label: 'Hero — Label stat' },
  { key: 'hero_volunteer_label', value: '100% Bénévoles', type: 'text', group: 'hero', label: 'Hero — Label bénévoles' },

  { key: 'stats_label_1', value: 'Donateurs', type: 'text', group: 'stats', label: 'Stats — Label 1' },
  { key: 'stats_label_2', value: 'FCFA collectés', type: 'text', group: 'stats', label: 'Stats — Label 2' },
  { key: 'stats_label_3', value: 'Bénévoles', type: 'text', group: 'stats', label: 'Stats — Label 3' },
  { key: 'stats_value_3', value: '100%', type: 'text', group: 'stats', label: 'Stats — Valeur 3' },
  { key: 'stats_label_4', value: 'Terminales solidaires', type: 'text', group: 'stats', label: 'Stats — Label 4' },
  { key: 'stats_value_4', value: 'ANJS', type: 'text', group: 'stats', label: 'Stats — Valeur 4' },

  { key: 'mission_badge', value: 'Notre mission', type: 'text', group: 'mission', label: 'Mission — Badge' },
  { key: 'mission_title', value: 'Ce que nous faisons', type: 'text', group: 'mission', label: 'Mission — Titre' },
  { key: 'mission_subtitle', value: 'Nous agissons sur le terrain pour améliorer la vie des plus vulnérables.', type: 'text', group: 'mission', label: 'Mission — Sous-titre' },
  { key: 'mission_1_title', value: 'Aide directe', type: 'text', group: 'mission', label: 'Mission 1 — Titre' },
  { key: 'mission_1_desc', value: 'Nourriture, vêtements et fournitures scolaires pour les familles dans le besoin.', type: 'text', group: 'mission', label: 'Mission 1 — Description' },
  { key: 'mission_1_image', value: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop', type: 'image', group: 'mission', label: 'Mission 1 — Image' },
  { key: 'mission_2_title', value: 'Réseau solidaire', type: 'text', group: 'mission', label: 'Mission 2 — Titre' },
  { key: 'mission_2_desc', value: 'Collaboration avec des écoles et associations partenaires pour un impact maximal.', type: 'text', group: 'mission', label: 'Mission 2 — Description' },
  { key: 'mission_2_image', value: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&h=400&fit=crop', type: 'image', group: 'mission', label: 'Mission 2 — Image' },
  { key: 'mission_3_title', value: 'Jeunesse engagée', type: 'text', group: 'mission', label: 'Mission 3 — Titre' },
  { key: 'mission_3_desc', value: "Des élèves de Terminale qui prouvent que la solidarité n'a pas d'âge.", type: 'text', group: 'mission', label: 'Mission 3 — Description' },
  { key: 'mission_3_image', value: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&h=400&fit=crop', type: 'image', group: 'mission', label: 'Mission 3 — Image' },

  { key: 'aid_badge', value: 'Urgences', type: 'text', group: 'aid', label: 'Aides — Badge' },
  { key: 'aid_title', value: "Demandes d'aide", type: 'text', group: 'aid', label: 'Aides — Titre' },
  { key: 'aid_subtitle', value: 'Ces familles ont besoin de votre soutien', type: 'text', group: 'aid', label: 'Aides — Sous-titre' },

  { key: 'events_badge', value: 'Agenda', type: 'text', group: 'events', label: 'Événements — Badge' },
  { key: 'events_title', value: 'Prochains événements', type: 'text', group: 'events', label: 'Événements — Titre' },
  { key: 'events_subtitle', value: 'Venez nous rejoindre', type: 'text', group: 'events', label: 'Événements — Sous-titre' },

  { key: 'news_badge', value: 'Blog', type: 'text', group: 'news', label: 'Actualités — Badge' },
  { key: 'news_title', value: 'Dernières actualités', type: 'text', group: 'news', label: 'Actualités — Titre' },
  { key: 'news_subtitle', value: 'Suivez nos actions sur le terrain', type: 'text', group: 'news', label: 'Actualités — Sous-titre' },

  { key: 'cta_title_1', value: 'Chaque geste', type: 'text', group: 'cta', label: 'CTA — Titre 1' },
  { key: 'cta_title_highlight', value: 'compte', type: 'text', group: 'cta', label: 'CTA — Mot surbrillance' },
  { key: 'cta_description', value: "Votre don, aussi petit soit-il, change une vie. Soutenez notre association et aidez-nous à construire un avenir meilleur.", type: 'text', group: 'cta', label: 'CTA — Description' },
  { key: 'cta_btn_primary', value: 'Faire un don maintenant', type: 'text', group: 'cta', label: 'CTA — Bouton principal' },
  { key: 'cta_btn_secondary', value: 'Devenir bénévole', type: 'text', group: 'cta', label: 'CTA — Bouton secondaire' },
  { key: 'cta_image', value: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1600&h=600&fit=crop', type: 'image', group: 'cta', label: 'CTA — Image de fond' },

  { key: 'about_hero_badge', value: 'Notre histoire', type: 'text', group: 'about', label: 'À propos — Badge hero' },
  { key: 'about_hero_title', value: "À propos de l'", type: 'text', group: 'about', label: 'À propos — Titre hero' },
  { key: 'about_hero_highlight', value: 'ANJS', type: 'text', group: 'about', label: 'À propos — Mot surbrillance' },
  { key: 'about_hero_desc', value: "Une association fondée par des lycéens déterminés à faire la différence dans la vie des plus vulnérables.", type: 'text', group: 'about', label: 'À propos — Description hero' },
  { key: 'about_hero_image', value: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=600&fit=crop', type: 'image', group: 'about', label: 'À propos — Image hero' },
  { key: 'about_history_title', value: 'Notre', type: 'text', group: 'about_history', label: 'Histoire — Titre' },
  { key: 'about_history_highlight', value: 'histoire', type: 'text', group: 'about_history', label: 'Histoire — Mot surbrillance' },
  { key: 'about_history_p1', value: "L'Association Nova Jeunesse pour la Solidarité (ANJS) est née de la volonté d'un groupe d'élèves de Terminale de transformer leur énergie et leur idéalisme en actions concrètes pour les personnes démunies.", type: 'textarea', group: 'about_history', label: 'Histoire — Paragraphe 1' },
  { key: 'about_history_p2', value: "Fondée sur les valeurs de solidarité, d'entraide et de responsabilité sociale, l'ANJS mobilise la jeunesse pour apporter une aide directe aux familles dans le besoin — nourriture, vêtements, fournitures scolaires et soutien moral.", type: 'textarea', group: 'about_history', label: 'Histoire — Paragraphe 2' },
  { key: 'about_history_p3', value: "Notre force réside dans notre réseau : des écoles partenaires, des associations solidaires et des bénévoles motivés qui œuvrent ensemble pour un impact durable.", type: 'textarea', group: 'about_history', label: 'Histoire — Paragraphe 3' },
  { key: 'about_history_image', value: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&h=500&fit=crop', type: 'image', group: 'about_history', label: 'Histoire — Image' },
  { key: 'about_quote', value: "La solidarité n'a pas d'âge. Quand la jeunesse s'engage, c'est tout un avenir qui change.", type: 'text', group: 'about_quote', label: 'Citation — Texte' },
  { key: 'about_quote_author', value: "L'équipe ANJS", type: 'text', group: 'about_quote', label: 'Citation — Auteur' },

  { key: 'about_value_1_title', value: 'Solidarité', type: 'text', group: 'about_values', label: 'Valeur 1 — Titre' },
  { key: 'about_value_1_desc', value: "Chaque action est guidée par l'empathie et le désir d'aider ceux qui traversent des moments difficiles.", type: 'text', group: 'about_values', label: 'Valeur 1 — Description' },
  { key: 'about_value_2_title', value: 'Collaboration', type: 'text', group: 'about_values', label: 'Valeur 2 — Titre' },
  { key: 'about_value_2_desc', value: 'Nous travaillons main dans la main avec des écoles et associations pour maximiser notre impact.', type: 'text', group: 'about_values', label: 'Valeur 2 — Description' },
  { key: 'about_value_3_title', value: 'Engagement', type: 'text', group: 'about_values', label: 'Valeur 3 — Titre' },
  { key: 'about_value_3_desc', value: "Des jeunes qui prouvent que l'âge n'est pas un obstacle à l'action citoyenne.", type: 'text', group: 'about_values', label: 'Valeur 3 — Description' },

  { key: 'footer_name', value: 'ANJS', type: 'text', group: 'footer', label: 'Footer — Nom' },
  { key: 'footer_description', value: "Association Nova Jeunesse pour la Solidarité — des lycéens engagés qui aident les personnes démunies.", type: 'text', group: 'footer', label: 'Footer — Description' },
  { key: 'footer_email', value: 'contact@anjs.org', type: 'text', group: 'footer', label: 'Footer — Email' },
  { key: 'footer_phone', value: '+235 XX XX XX XX', type: 'text', group: 'footer', label: 'Footer — Téléphone' },
  { key: 'footer_address', value: "N'Djamena, Tchad", type: 'text', group: 'footer', label: 'Footer — Adresse' },
  { key: 'footer_cta', value: 'Faire un don', type: 'text', group: 'footer', label: 'Footer — Bouton CTA' },
  { key: 'footer_copyright', value: 'Association Nova Jeunesse pour la Solidarité. Tous droits réservés.', type: 'text', group: 'footer', label: 'Footer — Copyright' },
];

async function main() {
  for (const item of CONTENT) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }
  console.log(`Seeded ${CONTENT.length} content items`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
