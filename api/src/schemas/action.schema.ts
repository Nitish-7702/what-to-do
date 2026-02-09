import { z } from 'zod';

// Input schema for POST /next-action
export const nextActionInputSchema = z.object({
  availableMinutes: z.number().min(5).max(1440),
  energy: z.number().min(1).max(5),
  context: z.enum(['HOME', 'WORK', 'OUTSIDE']),
  goals: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.number(),
    deadline: z.string().nullable().optional(),
  })).optional(),
});

// Output schema for LLM response
export const llmActionResponseSchema = z.object({
  title: z.string(),
  why_this: z.string(),
  steps: z.array(z.string()).min(3).max(6),
  time_minutes: z.number(),
  difficulty: z.number().min(1).max(5),
  success_criteria: z.string(),
  fallback_if_stuck: z.string(),
});

// Feedback input schema
export const feedbackInputSchema = z.object({
  actionId: z.string(),
  type: z.enum(['DONE', 'TOO_HARD', 'NOT_RELEVANT', 'RETRY']),
  note: z.string().nullable().optional(),
});
