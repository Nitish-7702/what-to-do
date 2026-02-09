import { Router } from 'express';
import { BillingController } from '../controllers/billing.controller';
import { requireAuthMiddleware } from '../middleware/auth';

const router = Router();

router.use(requireAuthMiddleware);

router.get('/status', BillingController.getStatus);

export const billingRoutes = router;
