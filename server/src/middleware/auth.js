import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { httpError } from './error.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw httpError(401, 'Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    next();
  } catch (err) {
    throw httpError(401, 'Unauthorized');
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw httpError(403, 'Forbidden');
    }
    next();
  };
}
