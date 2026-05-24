import { Router } from 'express';
import { z } from 'zod';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';
import { ssrCacheHeaders } from '../middleware/security';

const router = Router();

const articleSchema = z.object({
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string().min(10),
  coverImageUrl: z.string().url().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  isFeatured: z.boolean().default(false),
});

router.get('/', ssrCacheHeaders(60), async (req, res, next) => {
  try {
    const { featured, limit } = req.query;
    const articles = await prisma.newsArticle.findMany({
      where: {
        publishedAt: { not: null, lte: new Date() },
        ...(featured === 'true' ? { isFeatured: true } : {}),
      },
      select: {
        id: true, slug: true, title: true, excerpt: true,
        coverImageUrl: true, publishedAt: true, isFeatured: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: limit ? parseInt(limit as string) : undefined,
    });
    res.json({ success: true, data: articles });
  } catch (err) { next(err); }
});

router.get('/all', requireAdmin, async (_req, res, next) => {
  try {
    const articles = await prisma.newsArticle.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: articles });
  } catch (err) { next(err); }
});

router.get('/:slug', ssrCacheHeaders(120), async (req, res, next) => {
  try {
    const article = await prisma.newsArticle.findUnique({ where: { slug: req.params.slug } });
    if (!article) { res.status(404).json({ error: 'Article introuvable' }); return; }
    if (!article.publishedAt && !req.headers.authorization) {
      res.status(404).json({ error: 'Article introuvable' }); return;
    }
    res.json({ success: true, data: article });
  } catch (err) { next(err); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const parsed = articleSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    const existing = await prisma.newsArticle.findUnique({ where: { slug: data.slug } });
    if (existing) { res.status(409).json({ error: 'Ce slug est déjà utilisé' }); return; }
    const article = await prisma.newsArticle.create({
      data: { ...data, publishedAt: data.publishedAt ? new Date(data.publishedAt) : null },
    });
    res.status(201).json({ success: true, data: article });
  } catch (err) { next(err); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const parsed = articleSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const data = parsed.data;
    if (data.slug) {
      const existing = await prisma.newsArticle.findFirst({ where: { slug: data.slug, NOT: { id } } });
      if (existing) { res.status(409).json({ error: 'Ce slug est déjà utilisé' }); return; }
    }
    const article = await prisma.newsArticle.update({
      where: { id },
      data: { ...data, publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined },
    });
    res.json({ success: true, data: article });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    await prisma.newsArticle.delete({ where: { id } });
    res.json({ success: true, message: 'Article supprimé' });
  } catch (err) { next(err); }
});

export default router;
