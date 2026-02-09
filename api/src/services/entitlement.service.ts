import { prisma } from '../lib/prisma';
import { EntitlementStatus, Plan } from '@prisma/client';

export class EntitlementService {
  private static MAX_FREE_DAILY_ACTIONS = 5;

  static async getStatus(userId: string) {
    let entitlement = await prisma.entitlement.findUnique({
      where: { userId },
    });

    if (!entitlement) {
      // Create default free entitlement if missing
      entitlement = await prisma.entitlement.create({
        data: {
          userId,
          plan: Plan.FREE,
          status: EntitlementStatus.ACTIVE,
        },
      });
    }

    // Check if we need to reset daily count
    const today = new Date().toISOString().split('T')[0];
    const lastUsageDate = entitlement.lastUsageDate 
      ? entitlement.lastUsageDate.toISOString().split('T')[0] 
      : null;

    if (lastUsageDate !== today) {
      // It's a new day, effectively count is 0
      return {
        plan: entitlement.plan,
        usageCount: 0,
        remaining: entitlement.plan === Plan.PRO 
          ? 'UNLIMITED' 
          : this.MAX_FREE_DAILY_ACTIONS,
        limit: this.MAX_FREE_DAILY_ACTIONS
      };
    }

    const remaining = entitlement.plan === Plan.PRO
      ? 'UNLIMITED'
      : Math.max(0, this.MAX_FREE_DAILY_ACTIONS - entitlement.usageCount);

    return {
      plan: entitlement.plan,
      usageCount: entitlement.usageCount,
      remaining,
      limit: this.MAX_FREE_DAILY_ACTIONS
    };
  }

  static async checkAndIncrementUsage(userId: string): Promise<boolean> {
    const status = await this.getStatus(userId);

    if (status.plan === Plan.PRO) {
      // Pro users: just update lastUsageDate
      await prisma.entitlement.update({
        where: { userId },
        data: { lastUsageDate: new Date() }
      });
      return true;
    }

    if (typeof status.remaining === 'number' && status.remaining <= 0) {
      return false;
    }

    // Increment usage
    // We also need to handle the "reset" logic atomically if possible, 
    // or rely on the logic that if date changed, we set count to 1.
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Fetch again to lock/update
    // Note: Prisma doesn't do "select for update" easily without raw queries, 
    // but for this scale, standard update is fine.
    
    const entitlement = await prisma.entitlement.findUnique({ where: { userId } });
    if (!entitlement) return false; // Should not happen given getStatus creates it

    const lastUsageStr = entitlement.lastUsageDate 
      ? entitlement.lastUsageDate.toISOString().split('T')[0] 
      : null;

    if (lastUsageStr !== todayStr) {
      // Reset and increment to 1
      await prisma.entitlement.update({
        where: { userId },
        data: {
          usageCount: 1,
          lastUsageDate: today
        }
      });
    } else {
      // Same day, increment
      await prisma.entitlement.update({
        where: { userId },
        data: {
          usageCount: { increment: 1 },
          lastUsageDate: today
        }
      });
    }

    return true;
  }
}
