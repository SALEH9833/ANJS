import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';
import { ssrCacheHeaders } from '../middleware/security';

const router = Router();

const eventSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().max(5000).optional().nullable(),
  imageUrl: z.string().url().optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().nullable(),
  location: z.string().trim().max(200).optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'PAST']).default('DRAFT'),
});

router.get('/', ssrCacheHeaders(60), async (req, res, next) => {
  try {
    const { upcoming } = req.query;
    const events = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        ...(upcoming === 'true' ? { startDate: { gte: new Date() } } : {}),
      },
      orderBy: { startDate: 'asc' },
    });
    res.json({ success: true, data: events });
  } catch (err) { next(err); }
});

router.get('/all', requireAdmin, async (_req, res, next) => {
  try {
    const events = await prisma.event.findMany({ orderBy: { startDate: 'desc' } });
    res.json({ success: true, data: events });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) { res.status(404).json({ error: 'Événement introuvable' }); return; }
    if (event.status !== 'PUBLISHED' && !req.headers.authorization) {
      res.status(404).json({ error: 'Événement introuvable' }); return;
    }
    res.json({ success: true, data: event });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    const event = await prisma.event.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    res.status(201).json({ success: true, data: event });
  } catch (err) { next(err); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const parsed = eventSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });
    res.json({ success: true, data: event });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    await prisma.event.delete({ where: { id } });
    res.json({ success: true, message: 'Événement supprimé' });
  } catch (err) { next(err); }
});

export default router;
