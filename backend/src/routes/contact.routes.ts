import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de messages envoyés. Réessayez dans 1 heure.' },
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().max(120),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(3000),
});

router.post('/', contactLimiter, async (req, res, next) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    await prisma.contactMessage.create({ data: parsed.data });
    res.status(201).json({ success: true, message: 'Message envoyé ! Nous vous répondrons dans les plus brefs délais.' });
  } catch (err) { next(err); }
});

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const { unread } = req.query;
    const messages = await prisma.contactMessage.findMany({
      where: unread === 'true' ? { isRead: false } : {},
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: messages });
  } catch (err) { next(err); }
});

router.put('/:id/read', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const msg = await prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
    res.json({ success: true, data: msg });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ success: true, message: 'Message supprimé' });
  } catch (err) { next(err); }
});

export default router;
