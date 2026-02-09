import { Request, Response } from 'express';
import { EntitlementService } from '../services/entitlement.service';
import { StripeService } from '../services/stripe.service';
import { clerkClient } from '@clerk/express';

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

  static async createCheckoutSession(req: Request, res: Response) {
    try {
      const { userId } = req.auth;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Fetch user email from Clerk to pre-fill
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;

      if (!email) {
        res.status(400).json({ error: 'User email not found' });
        return;
      }

      const url = await StripeService.createCheckoutSession(userId, email);
      res.json({ url });
    } catch (error: any) {
      console.error('[CreateCheckout] Error:', error);
      res.status(500).json({ error: error.message || 'Failed to create checkout session' });
    }
  }

  static async createPortalSession(req: Request, res: Response) {
    try {
      const { userId } = req.auth;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const url = await StripeService.createPortalSession(userId);
      res.json({ url });
    } catch (error: any) {
      console.error('[CreatePortal] Error:', error);
      res.status(500).json({ error: error.message || 'Failed to create portal session' });
    }
  }
}
