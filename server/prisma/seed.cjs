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
  // gabeS@ user 
  await prisma.user.upsert({
    where: { firebase_id: "B0C6Id52VmakCRNHRzQOTOgEMln1" }, 
    update: {},
    create: {
      firebase_id: "B0C6Id52VmakCRNHRzQOTOgEMln1",
      first_name: "Gabriel",
      last_name: "Sahlin",
      birth_date: "2025-12-01T01:01:00Z",
      role: "BASIC",
    },
  });

   // nathanS@ user 
  await prisma.user.upsert({
    where: { firebase_id: "Dcu6Bz9jXONpXQi6boLK4H9oLsr2" }, 
    update: {},
    create: {
      firebase_id: "Dcu6Bz9jXONpXQi6boLK4H9oLsr2",
      first_name: "Nathan",
      last_name: "S",
      birth_date: "2025-12-01T01:01:00Z",
      role: "BASIC",
    },
  });

  // ethanK@ user 
  await prisma.user.upsert({
    where: { firebase_id: "87JE7o7rbQf897noxR6teWO66Xy2" }, 
    update: {},
    create: {
      firebase_id: "87JE7o7rbQf897noxR6teWO66Xy2",
      first_name: "Ethan",
      last_name: "K",
      birth_date: "2025-12-01T01:01:00Z",
      role: "BASIC",
    },
  });

  // phamb0532@ user 
  await prisma.user.upsert({
    where: { firebase_id: "LQvnVm8VkyUybrGJUZGwQ5Ny1an1" }, 
    update: {},
    create: {
      firebase_id: "LQvnVm8VkyUybrGJUZGwQ5Ny1an1",
      first_name: "Victoria",
      last_name: "P",
      birth_date: "2025-12-01T01:01:00Z",
      role: "BASIC",
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

  // Post seeding
  //Arena
  await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      user_id: 1,
      bar_id: 1,
      content: "Wow this place is awesome!",
      timestamp: new Date(),
    },
  });

  // Abbey
  await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      user_id: 1,
      bar_id: 2,
      content: "The drinks here are great!",
      timestamp: new Date(),
    },
  });

  await prisma.post.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      user_id: 1,
      bar_id: 2,
      content: "They definitely are!",
      timestamp: new Date(),
    },
  });

  // Party seeding
  await prisma.party.upsert({
    where: { id: 1},
    update: {},
    create: {
      id: 1,
      user_id: 1,
      name: "Birthday Bash",
      description: "Come celebrate my 21st birthday!",
      address: "123 Street Rd, Menomonie",
      start_time: "10:00:00",
      end_time: "12:00:00",
      longitude: -91.928315,
      latitude: 44.877466,
    },
  });

  // Friends seeding 

  await prisma.friends.upsert({
    where: { id: 1 },
    update: {},
    create: {
      requestor_id: 1,
      reciever_id: 3,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  
  await prisma.friends.upsert({
    where: { id: 3 },
    update: {},
    create: {
      requestor_id: 3,
      reciever_id: 1,
      status: "ACCEPTED",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  
  await prisma.friends.upsert({
    where: { id: 3 },
    update: {},
    create: {
      requestor_id: 3,
      reciever_id: 2,
      status: "ACCEPTED",
      createdAt: new Date(),
      updatedAt: new Date(),
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
