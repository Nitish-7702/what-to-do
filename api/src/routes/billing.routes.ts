import { Router } from 'express';
import { BillingController } from '../controllers/billing.controller';
import { requireAuthMiddleware } from '../middleware/auth';

const router = Router();

router.use(requireAuthMiddleware);

router.get('/status', BillingController.getStatus);
router.post('/create-checkout-session', BillingController.createCheckoutSession);
router.post('/create-portal-session', BillingController.createPortalSession);

export const billingRoutes = router;
