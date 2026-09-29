export const WHITELISTS = {
  users: {
    sort: ['name', 'email', 'address', 'role'],
    filter: ['name', 'email', 'address', 'role'],
  },
  stores: {
    sort: ['name', 'email', 'address', 'avgRating'],
    filter: ['name', 'email', 'address'],
  },
};

export function buildQuery(resource, queryParams) {
  const whitelist = WHITELISTS[resource] || { sort: [], filter: [] };
  const { sortBy, order = 'asc', ...filters } = queryParams;

  const validSort = whitelist.sort.includes(sortBy) ? sortBy : undefined;
  const validOrder = order === 'desc' ? 'desc' : 'asc';

  const where = {};
  for (const [key, value] of Object.entries(filters)) {
    if (whitelist.filter.includes(key) && value) {
      if (key === 'role') {
        where[key] = value;
      } else {
        where[key] = { contains: value, mode: 'insensitive' };
      }
    }
  }

  return { where, sortBy: validSort, order: validOrder };
}
