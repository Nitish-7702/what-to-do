import { Router } from 'express';
import { ActionController } from '../controllers/action.controller';
import { requireAuthMiddleware } from '../middleware/auth';
import { requireEntitlementOrLimit } from '../middleware/entitlement';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuthMiddleware);

router.post('/next-action', requireEntitlementOrLimit, ActionController.getNextAction);
router.get('/history', ActionController.getHistory);
router.post('/feedback', ActionController.submitFeedback);

export const actionRoutes = router;
