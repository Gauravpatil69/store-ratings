import { prisma } from '../db.js';
import { buildQuery } from '../lib/query.js';

export async function listUsers(req, res) {
  const query = buildQuery('users', req.query);

  const users = await prisma.user.findMany({
    where: query.where,
    orderBy: query.sortBy ? { [query.sortBy]: query.order } : { id: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
  });

  res.json({ users });
}

export async function createUser(req, res) {
  const { name, email, address, password, role } = req.body;
  const user = await prisma.user.create({
    data: { name, email, address, password, role },
    select: { id: true, name: true, email: true, role: true },
  });
  res.status(201).json({ user });
}

export async function getUser(req, res) {
  const id = parseInt(req.params.id, 10);
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      store: {
        select: {
          id: true,
          name: true,
          ratings: { select: { value: true } },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Calculate store average rating if owner
  if (user.role === 'OWNER' && user.store) {
    const ratings = user.store.ratings;
    const avgRating =
      ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length : 0;
    user.store.avgRating = avgRating;
    delete user.store.ratings;
  }

  res.json({ user });
}
