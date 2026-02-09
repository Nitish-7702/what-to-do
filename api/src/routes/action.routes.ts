import { Router } from 'express';
import { ActionController } from '../controllers/action.controller';
import { requireAuthMiddleware } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(requireAuthMiddleware);

router.post('/next-action', ActionController.getNextAction);
router.get('/history', ActionController.getHistory);
router.post('/feedback', ActionController.submitFeedback);

export const actionRoutes = router;
