import { Request, Response } from 'express';
import { EntitlementService } from '../services/entitlement.service';

export class BillingController {
  static async getStatus(req: Request, res: Response) {
    try {
      const { userId } = req.auth;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const status = await EntitlementService.getStatus(userId);
      res.json(status);
    } catch (error: any) {
      console.error('[BillingStatus] Error:', error);
      res.status(500).json({ error: 'Failed to fetch billing status' });
    }
  }
}
