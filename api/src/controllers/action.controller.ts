import { Request, Response } from 'express';
import { actionService } from '../services/action.service';
import { nextActionInputSchema, feedbackInputSchema } from '../schemas/action.schema';
import { z } from 'zod';

export class ActionController {
  
  static async getNextAction(req: Request, res: Response) {
    try {
      const { userId } = req.auth;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Validate Input
      const parseResult = nextActionInputSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ error: 'Invalid input', details: parseResult.error.errors });
        return;
      }

      console.log(`[NextAction] Generating action for user ${userId} with input:`, JSON.stringify(parseResult.data));

      const action = await actionService.generateNextAction(userId, parseResult.data);
      
      res.json(action);
    } catch (error: any) {
      console.error('[NextAction] Error:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const { userId } = req.auth;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const history = await actionService.getHistory(userId);
      res.json(history);
    } catch (error: any) {
      console.error('[GetHistory] Error:', error);
      res.status(500).json({ error: 'Failed to fetch history' });
    }
  }

  static async submitFeedback(req: Request, res: Response) {
    try {
      const { userId } = req.auth;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      // Validate Input
      const parseResult = feedbackInputSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({ error: 'Invalid input', details: parseResult.error.errors });
        return;
      }

      const feedback = await actionService.submitFeedback(
        userId,
        parseResult.data.actionId,
        parseResult.data.type,
        parseResult.data.note || undefined
      );

      res.json(feedback);
    } catch (error: any) {
      console.error('[SubmitFeedback] Error:', error);
      res.status(500).json({ error: error.message || 'Failed to submit feedback' });
    }
  }
}
