import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';

const router = Router();

const beneficiarySchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  age: z.number().int().min(0).max(120).optional().nullable(),
  address: z.string().trim().max(200).optional().nullable(),
  city: z.string().trim().max(80).optional().nullable(),
  phone: z.string().trim().max(20).optional().nullable(),
  photoUrl: z.string().url().optional().nullable(),
  householdSize: z.number().int().min(1).optional().nullable(),
  needsSummary: z.string().max(1000).optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'HELPED']).default('ACTIVE'),
  addedByVolunteerId: z.number().int().positive().optional().nullable(),
});

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const { status, city, q } = req.query;
    const beneficiaries = await prisma.beneficiary.findMany({
      where: {
        ...(status ? { status: status as string } : {}),
        ...(city ? { city: { contains: city as string, mode: 'insensitive' } } : {}),
        ...(q ? {
          OR: [
            { fullName: { contains: q as string, mode: 'insensitive' } },
            { city: { contains: q as string, mode: 'insensitive' } },
          ],
        } : {}),
      },
      include: {
        addedByVolunteer: { select: { id: true, firstName: true, lastName: true } },
        aidRequests: { select: { id: true, title: true, status: true, urgency: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: beneficiaries });
  } catch (err) { next(err); }
});

router.get('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id },
      include: {
        addedByVolunteer: { select: { id: true, firstName: true, lastName: true } },
        aidRequests: true,
      },
    });
    if (!beneficiary) { res.status(404).json({ error: 'Bénéficiaire introuvable' }); return; }
    res.json({ success: true, data: beneficiary });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const parsed = beneficiarySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const beneficiary = await prisma.beneficiary.create({ data: parsed.data });
    res.status(201).json({ success: true, data: beneficiary });
  } catch (err) { next(err); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const parsed = beneficiarySchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const beneficiary = await prisma.beneficiary.update({ where: { id }, data: parsed.data });
    res.json({ success: true, data: beneficiary });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    await prisma.beneficiary.delete({ where: { id } });
    res.json({ success: true, message: 'Bénéficiaire supprimé' });
  } catch (err) { next(err); }
});

export default router;
