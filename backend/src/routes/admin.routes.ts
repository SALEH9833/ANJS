import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';
import { noCacheHeaders } from '../middleware/security';

const router = Router();

router.use(requireAdmin);

router.get('/stats', noCacheHeaders, async (_req, res, next) => {
  try {
    const [
      volunteers,
      schools,
      partners,
      beneficiaries,
      aidRequests,
      donations,
      events,
      articles,
      contacts,
    ] = await Promise.all([
      prisma.volunteer.count(),
      prisma.school.count(),
      prisma.partnerAssociation.count(),
      prisma.beneficiary.count(),
      prisma.aidRequest.groupBy({ by: ['status'], _count: { id: true } }),
      prisma.donation.aggregate({ where: { status: 'CONFIRMED' }, _sum: { amount: true }, _count: { id: true } }),
      prisma.event.count({ where: { status: 'PUBLISHED', startDate: { gte: new Date() } } }),
      prisma.newsArticle.count({ where: { publishedAt: { not: null } } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
    ]);

    const aidByStatus = Object.fromEntries(
      aidRequests.map(r => [r.status, r._count.id])
    );

    const [volunteersActive, beneficiariesHelped] = await Promise.all([
      prisma.volunteer.count({ where: { status: 'ACTIVE' } }),
      prisma.beneficiary.count({ where: { status: 'HELPED' } }),
    ]);

    res.json({
      success: true,
      data: {
        volunteers: { total: volunteers, active: volunteersActive },
        schools,
        partners,
        beneficiaries: { total: beneficiaries, helped: beneficiariesHelped },
        aidRequests: {
          total: aidRequests.reduce((acc, r) => acc + r._count.id, 0),
          ...aidByStatus,
        },
        donations: {
          totalAmount: donations._sum.amount || 0,
          totalConfirmed: donations._count.id,
        },
        events: { upcoming: events },
        articles: { published: articles },
        contacts: { unread: contacts },
      },
    });
  } catch (err) { next(err); }
});

router.get('/chart-data', noCacheHeaders, async (_req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const donations = await prisma.donation.findMany({
      where: { createdAt: { gte: sixMonthsAgo }, status: 'CONFIRMED' },
      select: { amount: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const months: string[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      months.push(d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }));
    }

    const donsByMonth = months.map((label, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const m = d.getMonth();
      const y = d.getFullYear();
      const total = donations
        .filter(don => { const cd = new Date(don.createdAt); return cd.getMonth() === m && cd.getFullYear() === y; })
        .reduce((s, don) => s + Number(don.amount), 0);
      return { name: label, montant: total };
    });

    const recentDonations = await prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, donorName: true, amount: true, status: true, isAnonymous: true, createdAt: true },
    });

    const recentMessages = await prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, subject: true, isRead: true, createdAt: true },
    });

    res.json({ success: true, data: { donsByMonth, recentDonations, recentMessages } });
  } catch (err) { next(err); }
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8).max(200),
});

router.put('/password', noCacheHeaders, async (req, res, next) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Mot de passe actuel et nouveau (8+ caractères) requis' });
      return;
    }
    const { currentPassword, newPassword } = parsed.data;
    const user = await prisma.adminUser.findUnique({ where: { id: req.admin!.id } });
    if (!user) { res.status(404).json({ error: 'Compte introuvable' }); return; }
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) { res.status(401).json({ error: 'Mot de passe actuel incorrect' }); return; }
    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash: newHash } });
    res.json({ success: true, message: 'Mot de passe changé' });
  } catch (err) { next(err); }
});

const profileSchema = z.object({
  username: z.string().trim().min(3).max(60).optional(),
  email: z.string().email().max(120).optional().nullable(),
});

router.put('/profile', noCacheHeaders, async (req, res, next) => {
  try {
    const parsed = profileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    if (parsed.data.username) {
      const existing = await prisma.adminUser.findFirst({
        where: { username: parsed.data.username, NOT: { id: req.admin!.id } },
      });
      if (existing) { res.status(409).json({ error: 'Ce nom d\'utilisateur est déjà pris' }); return; }
    }
    const user = await prisma.adminUser.update({
      where: { id: req.admin!.id },
      data: parsed.data,
      select: { id: true, username: true, email: true, lastLogin: true },
    });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
});

export default router;
