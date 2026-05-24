import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const donationSchema = z.object({
  donorName: z.string().trim().max(100).optional().nullable(),
  donorEmail: z.string().email().max(120).optional().nullable(),
  amount: z.number().positive().max(100000),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'AIRTEL_MONEY', 'MOOV_MONEY', 'PAYPAL', 'OTHER']).default('OTHER'),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']).default('PENDING'),
  isAnonymous: z.boolean().default(false),
  dedicatedToAidRequestId: z.number().int().positive().optional().nullable(),
});

router.get('/stats', async (_req, res, next) => {
  try {
    const stats = await prisma.donation.aggregate({
      where: { status: 'CONFIRMED' },
      _sum: { amount: true },
      _count: { id: true },
    });
    const uniqueDonors = await prisma.donation.findMany({
      where: { status: 'CONFIRMED' },
      select: { donorEmail: true },
      distinct: ['donorEmail'],
    });
    res.json({
      success: true,
      data: { amount: Number(stats._sum.amount || 0), donors: uniqueDonors.length, totalAmount: stats._sum.amount || 0, totalDonors: stats._count.id },
    });
  } catch (err) { next(err); }
});

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const { status, method } = req.query;
    const donations = await prisma.donation.findMany({
      where: {
        ...(status ? { status: status as string } : {}),
        ...(method ? { paymentMethod: method as string } : {}),
      },
      include: { dedicatedToAidRequest: { select: { id: true, title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: donations });
  } catch (err) { next(err); }
});

router.get('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const donation = await prisma.donation.findUnique({
      where: { id },
      include: { dedicatedToAidRequest: true },
    });
    if (!donation) { res.status(404).json({ error: 'Don introuvable' }); return; }
    res.json({ success: true, data: donation });
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = donationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    if (data.isAnonymous) { data.donorName = null; data.donorEmail = null; }
    const donation = await prisma.donation.create({ data });
    res.status(201).json({
      success: true,
      message: 'Don enregistré, merci pour votre générosité !',
      data: { id: donation.id, amount: donation.amount, status: donation.status },
    });
  } catch (err) { next(err); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const parsed = donationSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const donation = await prisma.donation.update({ where: { id }, data: parsed.data });
    res.json({ success: true, data: donation });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    await prisma.donation.delete({ where: { id } });
    res.json({ success: true, message: 'Don supprimé' });
  } catch (err) { next(err); }
});

export default router;
