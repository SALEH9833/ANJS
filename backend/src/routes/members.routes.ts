import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';
import { ssrCacheHeaders } from '../middleware/security';

const router = Router();

const memberSchema = z.object({
  firstName: z.string().trim().min(2).max(60),
  lastName: z.string().trim().min(2).max(60),
  role: z.string().trim().min(2).max(100),
  email: z.string().email().max(120).optional().nullable(),
  phone: z.string().trim().max(20).optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  order: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

router.get('/', ssrCacheHeaders(120), async (_req, res, next) => {
  try {
    const members = await prisma.member.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    res.json({ success: true, data: members });
  } catch (err) { next(err); }
});

router.get('/all', requireAdmin, async (_req, res, next) => {
  try {
    const members = await prisma.member.findMany({ orderBy: { order: 'asc' } });
    res.json({ success: true, data: members });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const member = await prisma.member.findUnique({ where: { id } });
    if (!member) { res.status(404).json({ error: 'Membre introuvable' }); return; }
    res.json({ success: true, data: member });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const parsed = memberSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const member = await prisma.member.create({ data: parsed.data });
    res.status(201).json({ success: true, data: member });
  } catch (err) { next(err); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const parsed = memberSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const member = await prisma.member.update({ where: { id }, data: parsed.data });
    res.json({ success: true, data: member });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    await prisma.member.delete({ where: { id } });
    res.json({ success: true, message: 'Membre supprimé' });
  } catch (err) { next(err); }
});

export default router;
