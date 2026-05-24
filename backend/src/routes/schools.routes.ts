import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const schoolSchema = z.object({
  name: z.string().trim().min(2).max(120),
  address: z.string().trim().max(200).optional().nullable(),
  city: z.string().trim().max(80).optional().nullable(),
  contactName: z.string().trim().max(100).optional().nullable(),
  contactEmail: z.string().email().max(120).optional().nullable(),
  contactPhone: z.string().trim().max(20).optional().nullable(),
  logoUrl: z.string().url().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

router.get('/', async (_req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        city: true,
        logoUrl: true,
        coverImageUrl: true,
        description: true,
        _count: { select: { volunteers: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: schools });
  } catch (err) { next(err); }
});

router.get('/all', requireAdmin, async (_req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      include: { _count: { select: { volunteers: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: schools });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        volunteers: {
          where: { status: 'ACTIVE' },
          select: { id: true, firstName: true, lastName: true, photoUrl: true },
        },
      },
    });
    if (!school) { res.status(404).json({ error: 'École introuvable' }); return; }
    res.json({ success: true, data: school });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const parsed = schoolSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const school = await prisma.school.create({ data: parsed.data });
    res.status(201).json({ success: true, data: school });
  } catch (err) { next(err); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const parsed = schoolSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const school = await prisma.school.update({ where: { id }, data: parsed.data });
    res.json({ success: true, data: school });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    await prisma.school.delete({ where: { id } });
    res.json({ success: true, message: 'École supprimée' });
  } catch (err) { next(err); }
});

export default router;
