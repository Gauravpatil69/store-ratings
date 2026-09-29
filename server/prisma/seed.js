import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'System Administrator Name 123',
      address: '123 Admin Street, City, Country',
      password,
      role: 'ADMIN',
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      name: 'Store Owner Name For The Seed Data',
      address: '456 Owner Avenue, City, Country',
      password,
      role: 'OWNER',
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      email: 'user1@example.com',
      name: 'Normal User One Name For Seed 123',
      address: '789 User Blvd, City, Country',
      password,
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      email: 'user2@example.com',
      name: 'Normal User Two Name For Seed 456',
      address: '101 User Road, City, Country',
      password,
      role: 'USER',
    },
  });

  const store1 = await prisma.store.upsert({
    where: { email: 'store1@example.com' },
    update: {},
    create: {
      email: 'store1@example.com',
      name: 'Owner Store Name That Is Long Enough',
      address: '101 Owner Store Ave',
      ownerId: owner.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { email: 'store2@example.com' },
    update: {},
    create: {
      email: 'store2@example.com',
      name: 'Second Store Name Without An Owner',
      address: '202 Second Store Blvd',
    },
  });

  const store3 = await prisma.store.upsert({
    where: { email: 'store3@example.com' },
    update: {},
    create: {
      email: 'store3@example.com',
      name: 'Third Store Name Without An Owner',
      address: '303 Third Store Road',
    },
  });

  await prisma.rating.upsert({
    where: {
      userId_storeId: { userId: user1.id, storeId: store1.id },
    },
    update: {},
    create: {
      value: 5,
      userId: user1.id,
      storeId: store1.id,
    },
  });

  await prisma.rating.upsert({
    where: {
      userId_storeId: { userId: user2.id, storeId: store1.id },
    },
    update: {},
    create: {
      value: 4,
      userId: user2.id,
      storeId: store1.id,
    },
  });

  console.log('Seed logins:');
  console.log('Admin:', 'admin@example.com', 'Password123!');
  console.log('Owner:', 'owner@example.com', 'Password123!');
  console.log('User1:', 'user1@example.com', 'Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
