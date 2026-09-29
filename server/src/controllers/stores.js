import { prisma } from '../db.js';
import { buildQuery } from '../lib/query.js';

export async function listStores(req, res) {
  const query = buildQuery('stores', req.query);
  const currentUserId = req.user.id;

  const stores = await prisma.store.findMany({
    where: query.where,
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ratings: {
        select: {
          value: true,
          userId: true,
        },
      },
    },
  });

  const storesWithRatings = stores.map((store) => {
    const ratings = store.ratings;
    const avgRating =
      ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length : 0;

    const myRatingObj = ratings.find((r) => r.userId === currentUserId);

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      avgRating,
      myRating: myRatingObj ? myRatingObj.value : null,
    };
  });

  if (query.sortBy === 'avgRating') {
    storesWithRatings.sort((a, b) => {
      if (query.order === 'desc') {
        return b.avgRating - a.avgRating;
      }
      return a.avgRating - b.avgRating;
    });
  } else if (query.sortBy) {
    storesWithRatings.sort((a, b) => {
      const valA = a[query.sortBy] || '';
      const valB = b[query.sortBy] || '';
      if (valA < valB) return query.order === 'asc' ? -1 : 1;
      if (valA > valB) return query.order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  res.json({ stores: storesWithRatings });
}

export async function createStore(req, res) {
  const { name, email, address, ownerId } = req.body;
  const store = await prisma.store.create({
    data: { name, email, address, ownerId },
    select: { id: true, name: true, email: true, ownerId: true },
  });
  res.status(201).json({ store });
}

export async function getMyStore(req, res) {
  const store = await prisma.store.findUnique({
    where: { ownerId: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      ratings: {
        select: {
          value: true,
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
  });

  if (!store) {
    return res.status(404).json({ message: 'Store not found for this owner' });
  }

  const raters = store.ratings.map((r) => ({
    name: r.user.name,
    email: r.user.email,
    rating: r.value,
  }));

  const avgRating =
    store.ratings.length > 0
      ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
      : 0;

  res.json({
    store: { id: store.id, name: store.name, email: store.email, address: store.address },
    average: avgRating,
    raters,
  });
}

export async function rateStore(req, res) {
  const storeId = parseInt(req.params.id, 10);
  const { value } = req.body;
  const userId = req.user.id;

  const rating = await prisma.rating.upsert({
    where: {
      userId_storeId: { userId, storeId },
    },
    update: { value },
    create: { value, userId, storeId },
    select: { value: true },
  });

  res.json({ message: 'Rating updated', rating });
}
