import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '../prisma';
import { signAdminToken, requireAdmin } from '../middleware/auth';
import { loginLimiter, loginSlowDown, noCacheHeaders } from '../middleware/security';

const router = Router();

const loginSchema = z.object({
  username: z.string().trim().min(3).max(60),
  password: z.string().min(6).max(200),
});

// POST /api/auth/login
router.post('/login', loginLimiter, loginSlowDown, noCacheHeaders, async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Identifiants invalides' });
      return;
    }
    const { username, password } = parsed.data;

    const user = await prisma.adminUser.findUnique({ where: { username } });
    if (!user) {
      res.status(401).json({ error: 'Identifiants incorrects' });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Identifiants incorrects' });
      return;
    }

    await prisma.adminUser.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
    const token = signAdminToken({ id: user.id, username: user.username });
    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) { next(err); }
});

// GET /api/auth/me — current admin
router.get('/me', requireAdmin, async (req, res, next) => {
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: req.admin!.id },
      select: { id: true, username: true, email: true, lastLogin: true },
    });
    if (!user) {
      res.status(404).json({ error: 'Compte introuvable' });
      return;
    }
    res.json({ success: true, user });
  } catch (err) { next(err); }
});

// PUT /api/auth/me/password — change password
const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8).max(200),
});

router.put('/me/password', requireAdmin, async (req, res, next) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Mot de passe actuel et nouveau (8+ caractères) requis' });
      return;
    }
    const { currentPassword, newPassword } = parsed.data;
    const user = await prisma.adminUser.findUnique({ where: { id: req.admin!.id } });
    if (!user) {
      res.status(404).json({ error: 'Compte introuvable' });
      return;
    }
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Mot de passe actuel incorrect' });
      return;
    }
    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash: newHash } });
    res.json({ success: true, message: 'Mot de passe changé' });
  } catch (err) { next(err); }
});

export default router;
