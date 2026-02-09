import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { prisma } from './lib/prisma';
import { authMiddleware, requireAuthMiddleware } from './middleware/auth';
import { clerkClient } from '@clerk/express';
import { actionRoutes } from './routes/action.routes';
import { billingRoutes } from './routes/billing.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Routes
app.use(actionRoutes);
app.use('/billing', billingRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected /me endpoint
app.get('/me', requireAuthMiddleware, async (req, res) => {
  try {
    const { userId } = req.auth;
    
    if (!userId) {
       res.status(401).json({ error: 'Unauthorized' });
       return;
    }

    // Fetch user details from Clerk to get email
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
       res.status(400).json({ error: 'User has no email' });
       return;
    }

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { id: userId }, // Using Clerk ID as PK
      update: { email },
      create: {
        id: userId,
        email,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
      },
    });

    res.json(user);
  } catch (error) {
    console.error('Error in /me:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example DB route (protected)
app.get('/users', requireAuthMiddleware, async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Start server
const PORT = env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
