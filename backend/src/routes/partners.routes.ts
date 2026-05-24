import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const partnerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  logoUrl: z.string().url().optional().nullable(),
  coverImageUrl: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
  email: z.string().email().max(120).optional().nullable(),
  phone: z.string().trim().max(20).optional().nullable(),
  city: z.string().trim().max(80).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
});

router.get('/', async (_req, res, next) => {
  try {
    const partners = await prisma.partnerAssociation.findMany({ orderBy: { name: 'asc' } });
    res.json({ success: true, data: partners });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const partner = await prisma.partnerAssociation.findUnique({ where: { id } });
    if (!partner) { res.status(404).json({ error: 'Partenaire introuvable' }); return; }
    res.json({ success: true, data: partner });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const parsed = partnerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const partner = await prisma.partnerAssociation.create({ data: parsed.data });
    res.status(201).json({ success: true, data: partner });
  } catch (err) { next(err); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const parsed = partnerSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const partner = await prisma.partnerAssociation.update({ where: { id }, data: parsed.data });
    res.json({ success: true, data: partner });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    await prisma.partnerAssociation.delete({ where: { id } });
    res.json({ success: true, message: 'Partenaire supprimé' });
  } catch (err) { next(err); }
});

export default router;
