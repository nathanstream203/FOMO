const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Role seeding
  await prisma.roles.upsert({
    where: { name: "Basic" },
    update: {},
    create: {
      name: "Basic",
      description: "Basic user role",
    },
  });
  await prisma.roles.upsert({
    where: { name: "Manager" },
    update: {},
    create: {
      name: "Manager",
      description: "Manager of a bar",
    },
  });
  await prisma.roles.upsert({
    where: { name: "Admin" },
    update: {},
    create: {
      name: "Admin",
      description: "Admin of FOMO",
    },
  });
  // User seeding
  await prisma.users.upsert({
    where: { firebase_id: "1" },
    update: {},
    create: {
      firebase_id: "1",
      first_name: "dummy",
      last_name: "bob",
      birth_date: "2000-01-01T01:01:00Z",
      role: {
        connect: { name: "Basic" },
      },
    },
  });
  await prisma.users.upsert({
    where: { firebase_id: "2" },
    update: {},
    create: {
      firebase_id: "2",
      first_name: "dummy2",
      last_name: "bob2",
      birth_date: "2002-01-01T01:01:00Z",
      role: {
        connect: { name: "Admin" },
      },
    },
  });
  // Bar seeding
  await prisma.bar.upsert({
    where: { name: 'Test Bar 1' },
    update: {},
    create: {
      name: 'Test Bar 1',
      address: '123 Main St',
      latitude: 44.876503,
      longitude: -91.926781
    }
  })
  await prisma.bar.upsert({
    where: { name: 'Test Bar 2' },
    update: {},
    create: {
      name: 'Test Bar 2',
      address: '456 Main St',
      latitude: 44.876311,
      longitude: -91.929753
    }
  })
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
