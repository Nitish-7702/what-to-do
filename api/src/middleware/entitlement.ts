import { Request, Response, NextFunction } from 'express';
import { EntitlementService } from '../services/entitlement.service';

export const requireEntitlementOrLimit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.auth;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Check usage limits and increment if allowed
    const allowed = await EntitlementService.checkAndIncrementUsage(userId);

    if (!allowed) {
      res.status(403).json({ 
        error: 'Daily limit reached', 
        message: 'You have reached your daily limit of 5 actions. Please upgrade to Pro for unlimited access.' 
      });
      return;
    }

    next();
  } catch (error) {
    console.error('[EntitlementMiddleware] Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
