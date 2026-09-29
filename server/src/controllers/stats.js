import { prisma } from '../db.js';

export async function getStats(req, res) {
  const [users, stores, ratings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  res.json({ users, stores, ratings });
}
