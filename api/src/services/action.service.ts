import { openai } from '../lib/openai';
import { prisma } from '../lib/prisma';
import { llmActionResponseSchema, nextActionInputSchema } from '../schemas/action.schema';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

type NextActionInput = z.infer<typeof nextActionInputSchema>;
type LLMActionResponse = z.infer<typeof llmActionResponseSchema>;

export class ActionService {
  
  async generateNextAction(userId: string, data: NextActionInput) {
    // 1. Fetch goals if not provided
    let goals = data.goals;
    if (!goals || goals.length === 0) {
      const dbGoals = await prisma.goal.findMany({
        where: { userId },
        select: { 
          id: true, 
          title: true, 
          description: true, 
          priority: true, 
          deadline: true 
        }
      });
      
      goals = dbGoals.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        priority: g.priority,
        deadline: g.deadline ? g.deadline.toISOString() : null
      }));
    }

    // 2. Construct System and User Prompts
    const systemPrompt = `You are a productivity coach. Your job is to analyze the user's goals, context, energy, and time constraints to recommend the single most effective "Next Action".
    
    Output STRICT JSON only. No markdown, no explanations outside the JSON.
    The JSON must match this schema:
    {
      "title": "Action Title",
      "why_this": "Reasoning...",
      "steps": ["Step 1", "Step 2", "Step 3"...],
      "time_minutes": number,
      "difficulty": number (1-5),
      "success_criteria": "How to know it's done",
      "fallback_if_stuck": "What to do if blocked"
    }`;

    const userPrompt = `
      Context: ${data.context}
      Available Time: ${data.availableMinutes} minutes
      Energy Level: ${data.energy}/5
      
      Current Goals:
      ${JSON.stringify(goals, null, 2)}
      
      Please generate the next action.
    `;

    // 3. Call LLM with Retry Logic
    let modelUsed = 'gpt-3.5-turbo';
    let rawJson = '';
    let parsedAction: LLMActionResponse | null = null;
    let attempts = 0;
    const maxAttempts = 2;
    let lastError = '';

    while (attempts < maxAttempts && !parsedAction) {
      attempts++;
      try {
        const messages: any[] = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ];

        if (lastError && attempts > 1) {
          messages.push({ 
            role: 'user', 
            content: `The previous attempt failed validation with error: ${lastError}. Please fix the JSON structure and try again.` 
          });
        }

        const completion = await openai.chat.completions.create({
          model: modelUsed,
          messages,
          response_format: { type: 'json_object' },
          temperature: 0.7,
        });

        rawJson = completion.choices[0].message.content || '{}';
        const json = JSON.parse(rawJson);
        
        // Validate with Zod
        parsedAction = llmActionResponseSchema.parse(json);

      } catch (error: any) {
        console.error(`Attempt ${attempts} failed:`, error);
        lastError = error.message || 'Unknown error';
        if (attempts === maxAttempts) {
          throw new Error(`Failed to generate valid action after ${maxAttempts} attempts. Last error: ${lastError}`);
        }
      }
    }

    if (!parsedAction) {
       throw new Error('Failed to generate action');
    }

    // 4. Save to Database
    const savedAction = await prisma.action.create({
      data: {
        userId,
        // If the action is strongly tied to a specific goal, the LLM might tell us, 
        // but for now we'll leave goalId null or try to infer it if we asked the LLM to return goalId.
        // The schema doesn't ask for goalId back, so we leave it null.
        goalId: null, 
        title: parsedAction.title,
        whyThis: parsedAction.why_this,
        steps: parsedAction.steps,
        timeMinutes: parsedAction.time_minutes,
        difficulty: parsedAction.difficulty,
        successCriteria: parsedAction.success_criteria,
        fallbackIfStuck: parsedAction.fallback_if_stuck,
        modelUsed,
        rawJson,
      }
    });

    return savedAction;
  }

  async getHistory(userId: string) {
    return prisma.action.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  async submitFeedback(userId: string, actionId: string, type: 'DONE' | 'TOO_HARD' | 'NOT_RELEVANT' | 'RETRY', note?: string) {
    // Verify action belongs to user
    const action = await prisma.action.findUnique({
      where: { id: actionId },
    });

    if (!action || action.userId !== userId) {
      throw new Error('Action not found or unauthorized');
    }

    return prisma.feedback.create({
      data: {
        userId,
        actionId,
        type,
        note
      }
    });
  }
}

export const actionService = new ActionService();
