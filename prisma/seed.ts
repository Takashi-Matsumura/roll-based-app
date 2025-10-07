import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo users
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: {
      email: "user1@example.com",
      name: "Regular User 1",
      role: "USER",
      emailVerified: new Date(),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user2@example.com" },
    update: {},
    create: {
      email: "user2@example.com",
      name: "Regular User 2",
      role: "USER",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("Created users:");
  console.log(`  - ${admin.email} (${admin.role})`);
  console.log(`  - ${user1.email} (${user1.role})`);
  console.log(`  - ${user2.email} (${user2.role})`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
