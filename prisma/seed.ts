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

  const manager = await prisma.user.upsert({
    where: { email: "manager@example.com" },
    update: {},
    create: {
      email: "manager@example.com",
      name: "Manager User",
      role: "MANAGER",
      emailVerified: new Date(),
    },
  });

  const backoffice = await prisma.user.upsert({
    where: { email: "backoffice@example.com" },
    update: {},
    create: {
      email: "backoffice@example.com",
      name: "Back Office User",
      role: "BACKOFFICE",
      emailVerified: new Date(),
    },
  });

  // Create permissions
  const permissions = [
    {
      name: "reports",
      displayName: "Reports",
      description: "Access to reports feature",
      menuPath: "/reports",
    },
    {
      name: "analytics",
      displayName: "Analytics",
      description: "Access to analytics feature",
      menuPath: "/analytics",
    },
    {
      name: "advanced_settings",
      displayName: "Advanced Settings",
      description: "Access to advanced settings feature",
      menuPath: "/advanced-settings",
    },
  ];

  console.log("Creating permissions...");
  for (const permissionData of permissions) {
    await prisma.permission.upsert({
      where: { name: permissionData.name },
      update: {},
      create: permissionData,
    });
  }

  // Create a demo Access key
  const demoAccessKey = await prisma.accessKey.upsert({
    where: { key: "DEMO-KEY-REPORTS-2025" },
    update: {},
    create: {
      key: "DEMO-KEY-REPORTS-2025",
      name: "Demo Report Access Key",
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isActive: true,
      createdBy: admin.id,
      permissions: {
        create: {
          permission: {
            connect: { name: "reports" },
          },
        },
      },
    },
  });

  const demoAccessKey2 = await prisma.accessKey.upsert({
    where: { key: "DEMO-KEY-FULL-ACCESS-2025" },
    update: {},
    create: {
      key: "DEMO-KEY-FULL-ACCESS-2025",
      name: "Demo Full Access Key",
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isActive: true,
      createdBy: admin.id,
      permissions: {
        create: [
          {
            permission: {
              connect: { name: "reports" },
            },
          },
          {
            permission: {
              connect: { name: "analytics" },
            },
          },
          {
            permission: {
              connect: { name: "advanced_settings" },
            },
          },
        ],
      },
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("Created users:");
  console.log(`  - ${admin.email} (${admin.role})`);
  console.log(`  - ${user1.email} (${user1.role})`);
  console.log(`  - ${user2.email} (${user2.role})`);
  console.log(`  - ${manager.email} (${manager.role})`);
  console.log(`  - ${backoffice.email} (${backoffice.role})`);
  console.log("\nCreated permissions:");
  console.log(`  - ${permissions.length} permissions`);
  console.log("\nCreated demo Access keys:");
  console.log(`  - ${demoAccessKey.key} (${demoAccessKey.name})`);
  console.log(`  - ${demoAccessKey2.key} (${demoAccessKey2.name})`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
