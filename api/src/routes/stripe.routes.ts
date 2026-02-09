import express from 'express';
import { StripeService } from '../services/stripe.service';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).send('Webhook Error: Missing signature');
    return;
  }

  try {
    const event = StripeService.constructEvent(req.body, sig as string);
    await StripeService.handleWebhook(event);
    res.json({ received: true });
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export const stripeRoutes = router;
