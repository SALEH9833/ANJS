# Guide de Deploiement ANJS

## Architecture
- **Frontend** : Next.js 14 → Vercel (gratuit)
- **Backend** : Express + Prisma → Render (gratuit)
- **Base de donnees** : PostgreSQL → Render (gratuit)
- **Images** : Cloudinary (gratuit jusqu'a 25GB)

---

## 1. Base de donnees (Render)

1. Aller sur https://render.com et creer un compte
2. Dashboard → New → PostgreSQL
3. Nom : `anjs-db`, Region : Frankfurt, Plan : Free
4. Copier la **External Database URL** (format : `postgresql://user:pass@host/db`)

## 2. Backend (Render)

1. Pousser le code backend sur GitHub
2. Render Dashboard → New → Web Service
3. Connecter le repo GitHub, dossier : `backend`
4. Configuration :
   - Build Command : `npm ci && npx prisma generate && npm run build`
   - Start Command : `npx prisma migrate deploy && node dist/server.js`
5. Variables d'environnement :
   - `DATABASE_URL` = URL PostgreSQL de l'etape 1
   - `NODE_ENV` = production
   - `PORT` = 4000
   - `JWT_SECRET` = (generer une chaine aleatoire de 64 caracteres)
   - `JWT_EXPIRES_IN` = 7d
   - `FRONTEND_URL` = https://anjs.vercel.app (URL Vercel)
   - `ADMIN_USERNAME` = admin
   - `ADMIN_PASSWORD` = (mot de passe fort)
   - `ADMIN_EMAIL` = admin@anjs.org
   - `CLOUDINARY_CLOUD_NAME` = (depuis cloudinary.com)
   - `CLOUDINARY_API_KEY` = (depuis cloudinary.com)
   - `CLOUDINARY_API_SECRET` = (depuis cloudinary.com)

## 3. Frontend (Vercel)

1. Aller sur https://vercel.com et connecter GitHub
2. Importer le repo, dossier racine : `frontend`
3. Variables d'environnement :
   - `NEXT_PUBLIC_API_URL` = https://anjs-api.onrender.com (URL Render)
4. Deployer

## 4. Cloudinary (Images)

1. Creer un compte sur https://cloudinary.com
2. Dashboard → copier Cloud Name, API Key, API Secret
3. Les ajouter dans les variables Render (etape 2)

## 5. Apres deploiement

1. Aller sur `https://anjs-api.onrender.com/api/content` pour verifier que l'API repond
2. Executer le seed : depuis le shell Render, lancer `npx tsx prisma/seed-content.ts`
3. Se connecter sur `https://anjs.vercel.app/admin/login` avec les identifiants admin
4. Commencer a ajouter le contenu

## 6. Nom de domaine personnalise (optionnel)

- Vercel : Settings → Domains → Ajouter `www.anjs.org`
- Configurer les DNS chez le registrar (pointer vers Vercel)
- Mettre a jour `FRONTEND_URL` sur Render avec le nouveau domaine

---

## Commandes utiles

```bash
# Backend local
cd backend
npm run dev

# Frontend local
cd frontend
npm run dev

# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build

# Seed contenu
cd backend
npx tsx prisma/seed-content.ts

# Migrations
cd backend
npx prisma migrate dev
```
