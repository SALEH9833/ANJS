import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const volunteerSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  email: z.string().email().max(120),
  phone: z.string().trim().max(20).optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  birthDate: z.string().datetime().optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  schoolId: z.number().int().positive().optional().nullable(),
});

router.get('/', async (_req, res, next) => {
  try {
    const volunteers = await prisma.volunteer.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        bio: true,
        school: { select: { name: true, city: true } },
      },
      orderBy: { joinedAt: 'asc' },
    });
    res.json({ success: true, data: volunteers });
  } catch (err) { next(err); }
});

router.get('/all', requireAdmin, async (_req, res, next) => {
  try {
    const volunteers = await prisma.volunteer.findMany({
      include: { school: { select: { id: true, name: true, city: true } } },
      orderBy: { joinedAt: 'desc' },
    });
    res.json({ success: true, data: volunteers });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const volunteer = await prisma.volunteer.findUnique({
      where: { id },
      include: { school: { select: { name: true, city: true } } },
    });
    if (!volunteer) { res.status(404).json({ error: 'Bénévole introuvable' }); return; }
    res.json({ success: true, data: volunteer });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const parsed = volunteerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    const volunteer = await prisma.volunteer.create({
      data: { ...data, birthDate: data.birthDate ? new Date(data.birthDate) : null },
    });
    res.status(201).json({ success: true, data: volunteer });
  } catch (err) { next(err); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const parsed = volunteerSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    const volunteer = await prisma.volunteer.update({
      where: { id },
      data: { ...data, birthDate: data.birthDate ? new Date(data.birthDate) : undefined },
    });
    res.json({ success: true, data: volunteer });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    await prisma.volunteer.delete({ where: { id } });
    res.json({ success: true, message: 'Bénévole supprimé' });
  } catch (err) { next(err); }
});

export default router;
