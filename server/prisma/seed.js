const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // User seeding
  await prisma.user.upsert({
    where: { firebase_id: "1" },
    update: {},
    create: {
      firebase_id: "1",
      first_name: "dummy",
      last_name: "bob",
      birth_date: "2000-01-01T01:01:00Z",
      role: "BASIC",
      points: 500,
    },
  });
  await prisma.user.upsert({
    where: { firebase_id: "2" },
    update: {},
    create: {
      firebase_id: "2",
      first_name: "dummy2",
      last_name: "bob2",
      birth_date: "2002-01-01T01:01:00Z",
      role: "MANAGER",
    },
  });
  // Bar seeding
  await prisma.bar.upsert({
    where: { name: "The Arena" },
    update: {},
    create: {
      name: "The Arena",
      address: "619 Broadway St S",
      latitude: 44.877597,
      longitude: -91.930157,
    },
  });
  await prisma.bar.upsert({
    where: { name: "The Abbey Pub and Grub" },
    update: {},
    create: {
      name: "The Abbey Pub and Grub",
      address: "402 Main St E",
      latitude: 44.8766,
      longitude: -91.925509,
    },
  });
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
