import { PrismaClient, Context, Plan, EntitlementStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const email = 'demo@example.com';
  
  // Cleanup existing user if exists (for re-runnability)
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      email,
      name: 'Demo User',
      entitlement: {
        create: {
          plan: Plan.FREE,
          status: EntitlementStatus.ACTIVE,
        },
      },
      goals: {
        create: [
          {
            title: 'Learn Prisma',
            description: 'Master Prisma ORM with Postgres',
            priority: 5,
            deadline: new Date(new Date().setDate(new Date().getDate() + 7)), // 1 week from now
          },
          {
            title: 'Build Next Action App',
            description: 'Create a productivity app using PERN stack',
            priority: 4,
          },
        ],
      },
      constraints: {
        create: {
          availableMinutes: 120,
          energy: 4,
          context: Context.HOME,
        },
      },
    },
    include: {
      goals: true,
      entitlement: true,
    },
  });

  console.log(`Created user with id: ${user.id}`);

  // Create an action linked to the first goal
  if (user.goals.length > 0) {
    const action = await prisma.action.create({
      data: {
        userId: user.id,
        goalId: user.goals[0].id,
        title: 'Read Prisma Docs',
        whyThis: 'Foundation for understanding schema',
        steps: ['Go to prisma.io', 'Read Quickstart', 'Try example'],
        timeMinutes: 30,
        difficulty: 2,
        successCriteria: 'Run first query',
        fallbackIfStuck: 'Watch YouTube tutorial',
      },
    });
    console.log(`Created action with id: ${action.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
