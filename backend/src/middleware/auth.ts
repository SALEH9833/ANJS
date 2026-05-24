import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'CHANGE_ME_IN_PRODUCTION';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'];

export interface AdminTokenPayload {
  id: number;
  username: string;
  kind: 'admin';
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminTokenPayload;
    }
  }
}

export function signAdminToken(payload: Omit<AdminTokenPayload, 'kind'>): string {
  return jwt.sign({ ...payload, kind: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token manquant' });
    return;
  }
  const token = header.slice(7).trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    if (decoded.kind !== 'admin') {
      res.status(403).json({ error: 'Accès refusé' });
      return;
    }
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}
