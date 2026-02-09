import { clerkMiddleware, requireAuth } from '@clerk/express';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include Auth property
declare global {
  namespace Express {
    interface Request {
      auth: {
        userId: string | null;
        sessionId: string | null;
        getToken: () => Promise<string | null>;
        claims: any;
      };
    }
  }
}

export const authMiddleware = clerkMiddleware();

export const requireAuthMiddleware = requireAuth();
