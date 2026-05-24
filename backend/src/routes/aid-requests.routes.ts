import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const aidRequestSchema = z.object({
  beneficiaryId: z.number().int().positive(),
  category: z.enum(['FOOD', 'CLOTHING', 'SCHOOL_SUPPLIES', 'MEDICAL', 'HOUSING', 'OTHER']),
  title: z.string().trim().min(3).max(150),
  description: z.string().max(2000).optional().nullable(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'FULFILLED', 'CANCELLED']).default('PENDING'),
  volunteerId: z.number().int().positive().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
});

router.get('/', async (req, res, next) => {
  try {
    const { category, urgency, status } = req.query;
    const requests = await prisma.aidRequest.findMany({
      where: {
        ...(category ? { category: category as string } : {}),
        ...(urgency ? { urgency: urgency as string } : {}),
        ...(status ? { status: status as string } : { status: { in: ['PENDING', 'IN_PROGRESS'] } }),
      },
      select: {
        id: true,
        category: true,
        title: true,
        description: true,
        urgency: true,
        status: true,
        imageUrl: true,
        createdAt: true,
      },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: requests });
  } catch (err) { next(err); }
});

router.get('/admin', requireAdmin, async (req, res, next) => {
  try {
    const { category, urgency, status } = req.query;
    const requests = await prisma.aidRequest.findMany({
      where: {
        ...(category ? { category: category as string } : {}),
        ...(urgency ? { urgency: urgency as string } : {}),
        ...(status ? { status: status as string } : {}),
      },
      include: {
        beneficiary: { select: { id: true, fullName: true, city: true } },
        volunteer: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: [{ urgency: 'desc' }, { createdAt: 'desc' }],
    });
    res.json({ success: true, data: requests });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const request = await prisma.aidRequest.findUnique({
      where: { id },
      select: {
        id: true, category: true, title: true, description: true,
        urgency: true, status: true, imageUrl: true, createdAt: true, updatedAt: true,
      },
    });
    if (!request) { res.status(404).json({ error: 'Demande introuvable' }); return; }
    res.json({ success: true, data: request });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const parsed = aidRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const request = await prisma.aidRequest.create({ data: parsed.data });
    res.status(201).json({ success: true, data: request });
  } catch (err) { next(err); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const parsed = aidRequestSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const request = await prisma.aidRequest.update({ where: { id }, data: parsed.data });
    res.json({ success: true, data: request });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    await prisma.aidRequest.delete({ where: { id } });
    res.json({ success: true, message: 'Demande supprimée' });
  } catch (err) { next(err); }
});

export default router;
