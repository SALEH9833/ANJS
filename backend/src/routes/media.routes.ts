import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import prisma from '../prisma';
import { requireAdmin } from '../middleware/auth';

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Seules les images sont acceptées'));
  },
});

function uploadToCloudinary(buffer: Buffer, folder: string): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `anjs/${folder}`, resource_type: 'image' },
      (err, result) => {
        if (err || !result) return reject(err || new Error('Upload failed'));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

const mediaMetaSchema = z.object({
  altText: z.string().trim().max(200).optional().nullable(),
  category: z.enum(['GENERAL', 'EVENT', 'VOLUNTEER', 'BENEFICIARY', 'PARTNER', 'NEWS']).default('GENERAL'),
});

router.post('/upload', requireAdmin, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) { res.status(400).json({ error: 'Aucun fichier fourni' }); return; }
    const meta = mediaMetaSchema.safeParse(req.body);
    const category = meta.success ? meta.data.category : 'GENERAL';
    const altText = meta.success ? meta.data.altText : null;
    const { url, publicId } = await uploadToCloudinary(req.file.buffer, category.toLowerCase());
    const asset = await prisma.mediaAsset.create({
      data: { filename: publicId, url, altText, category, sizeBytes: req.file.size },
    });
    res.status(201).json({ success: true, data: asset });
  } catch (err) { next(err); }
});

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const { category } = req.query;
    const assets = await prisma.mediaAsset.findMany({
      where: category ? { category: category as string } : {},
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: assets });
  } catch (err) { next(err); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const parsed = mediaMetaSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Données invalides', details: parsed.error.flatten() });
      return;
    }
    const asset = await prisma.mediaAsset.update({ where: { id }, data: parsed.data });
    res.json({ success: true, data: asset });
  } catch (err) { next(err); }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) { res.status(400).json({ error: 'ID invalide' }); return; }
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) { res.status(404).json({ error: 'Média introuvable' }); return; }
    await cloudinary.uploader.destroy(asset.filename);
    await prisma.mediaAsset.delete({ where: { id } });
    res.json({ success: true, message: 'Média supprimé' });
  } catch (err) { next(err); }
});

export default router;
