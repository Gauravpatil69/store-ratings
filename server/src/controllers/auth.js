import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';
import { config } from '../config.js';
import { httpError } from '../middleware/error.js';

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, { expiresIn: '1d' });
}

export async function signup(req, res) {
  const { name, email, address, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw httpError(409, 'Email is already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      address,
      password: hashedPassword,
      role: 'USER',
    },
    select: { id: true, name: true, email: true, address: true, role: true },
  });

  res.status(201).json({ message: 'User created' });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const errorMsg = 'Invalid email or password';

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw httpError(401, errorMsg);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw httpError(401, errorMsg);
  }

  const token = generateToken(user);

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}

export async function getMe(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) throw httpError(404, 'User not found');
  res.json({ user });
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) throw httpError(404, 'User not found');

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    throw httpError(400, 'Incorrect current password');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  res.json({ message: 'Password updated successfully' });
}
