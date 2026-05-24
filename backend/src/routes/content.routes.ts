import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';
import { ssrCacheHeaders } from '../middleware/security';

const router = Router();

router.get('/', ssrCacheHeaders(60), async (_req, res, next) => {
  try {
    const items = await prisma.siteContent.findMany({ orderBy: { group: 'asc' } });
    const map: Record<string, string> = {};
    items.forEach(item => { map[item.key] = item.value; });
    res.json({ success: true, data: map });
  } catch (err) { next(err); }
});

router.get('/all', requireAdmin, async (_req, res, next) => {
  try {
    const items = await prisma.siteContent.findMany({ orderBy: [{ group: 'asc' }, { id: 'asc' }] });
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
});

const updateSchema = z.object({
  key: z.string().trim().min(1).max(100),
  value: z.string().max(5000),
});

const batchSchema = z.object({
  items: z.array(z.object({
    key: z.string().trim().min(1).max(100),
    value: z.string().max(5000),
  })),
});

router.put('/:key', requireAdmin, async (req, res, next) => {
  try {
    const parsed = updateSchema.safeParse({ key: req.params.key, value: req.body.value });
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const item = await prisma.siteContent.upsert({
      where: { key: parsed.data.key },
      update: { value: parsed.data.value },
      create: { key: parsed.data.key, value: parsed.data.value, group: 'custom', label: parsed.data.key },
    });
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
});

router.put('/', requireAdmin, async (req, res, next) => {
  try {
    const parsed = batchSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    await prisma.$transaction(
      parsed.data.items.map(item =>
        prisma.siteContent.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value, group: 'custom', label: item.key },
        })
      )
    );
    res.json({ success: true, message: 'Contenu mis à jour' });
  } catch (err) { next(err); }
});

export default router;
