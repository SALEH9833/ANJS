import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import bcrypt from 'bcryptjs';

import prisma from './prisma';
import { applySecurity } from './middleware/security';
import { notFoundHandler, errorHandler } from './middleware/error';

import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import volunteersRoutes from './routes/volunteers.routes';
import schoolsRoutes from './routes/schools.routes';
import partnersRoutes from './routes/partners.routes';
import beneficiariesRoutes from './routes/beneficiaries.routes';
import aidRequestsRoutes from './routes/aid-requests.routes';
import donationsRoutes from './routes/donations.routes';
import eventsRoutes from './routes/events.routes';
import newsRoutes from './routes/news.routes';
import mediaRoutes from './routes/media.routes';
import contactRoutes from './routes/contact.routes';
import membersRoutes from './routes/members.routes';
import contentRoutes from './routes/content.routes';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

applySecurity(app);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'degraded', timestamp: new Date().toISOString() });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/volunteers', volunteersRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/beneficiaries', beneficiariesRoutes);
app.use('/api/aid-requests', aidRequestsRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/content', contentRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap(): Promise<void> {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.warn('[Bootstrap] ADMIN_PASSWORD missing — skipping admin creation');
    return;
  }
  try {
    const existing = await prisma.adminUser.findUnique({ where: { username } });
    if (existing) {
      console.log(`[Bootstrap] Admin "${username}" already exists`);
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.adminUser.create({
      data: { username, passwordHash, email: process.env.ADMIN_EMAIL || null },
    });
    console.log(`[Bootstrap] Admin "${username}" created`);
  } catch (err) {
    console.error('[Bootstrap] Failed:', err);
  }
}

(async () => {
  await bootstrap();
  app.listen(PORT, () => {
    console.log(`\n🚀 ANJS Backend running`);
    console.log(`   Local:    http://localhost:${PORT}`);
    console.log(`   Health:   http://localhost:${PORT}/health`);
    console.log(`   Env:      ${process.env.NODE_ENV || 'development'}\n`);
  });
})();
