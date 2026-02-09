import Stripe from 'stripe';
import { prisma } from '../lib/prisma';
import { EntitlementStatus, Plan } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

export class StripeService {
  
  static async createCheckoutSession(userId: string, email: string) {
    // Check if user already has a stripe customer id in our DB (optional if we stored it)
    // For now we'll rely on email matching or let Stripe create a new one.
    // Ideally we store stripeCustomerId on User model.

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      client_reference_id: userId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/billing?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/billing?canceled=true`,
      metadata: {
        userId,
      },
    });

    return session.url;
  }

  static async createPortalSession(userId: string) {
    // We need stripeCustomerId to create portal session.
    // Since we didn't add stripeCustomerId to User model yet, we might need to fetch from Stripe 
    // or we should add it to the schema. 
    // For now, let's search customer by email or metadata.
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.email) throw new Error('User not found');

    const customers = await stripe.customers.search({
      query: `email:'${user.email}'`,
    });

    if (customers.data.length === 0) {
      throw new Error('No Stripe customer found for this user');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${process.env.CLIENT_URL}/billing`,
    });

    return session.url;
  }

  static async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId || session.client_reference_id;
        
        if (userId) {
          await this.updateEntitlement(userId, Plan.PRO, EntitlementStatus.ACTIVE);
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        // Find user by customer ID if we stored it, or search via email is risky here since webhook doesn't have email directly always.
        // But checkout session passed userId in metadata.
        // Subscription object doesn't have metadata from checkout session automatically unless configured.
        // Better approach: Store stripeCustomerId on User when checkout completes.
        
        // For this MVP, let's assume we can find the user via the customer's email.
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        
        if (customer.email) {
          const user = await prisma.user.findUnique({ where: { email: customer.email } });
          if (user) {
            const isActive = subscription.status === 'active';
            await this.updateEntitlement(
              user.id, 
              isActive ? Plan.PRO : Plan.FREE,
              isActive ? EntitlementStatus.ACTIVE : EntitlementStatus.INACTIVE,
              new Date(subscription.current_period_end * 1000)
            );
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        
        if (customer.email) {
           const user = await prisma.user.findUnique({ where: { email: customer.email } });
           if (user) {
             await this.updateEntitlement(user.id, Plan.FREE, EntitlementStatus.INACTIVE);
           }
        }
        break;
      }
    }
  }

  private static async updateEntitlement(userId: string, plan: Plan, status: EntitlementStatus, periodEnd?: Date) {
    await prisma.entitlement.upsert({
      where: { userId },
      update: {
        plan,
        status,
        periodEnd,
        // If switching to PRO, maybe we reset usage limit logic or just leave it.
        // EntitlementService handles PRO as unlimited regardless of count.
      },
      create: {
        userId,
        plan,
        status,
        periodEnd,
      }
    });
  }

  static constructEvent(payload: string | Buffer, sig: string) {
    return stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  }
}
