/* ============================================================
   Auth Controller
   ============================================================ */
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

const prisma = new PrismaClient();

const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ── POST /api/auth/admin-login ─────────────────────────────
const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = z.object({
      username: z.string().min(1),
      password: z.string().min(1),
    }).parse(req.body);

    const staff = await prisma.staff.findFirst({
      where: { username, role: 'ADMIN' },
    });

    if (!staff || !staff.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, staff.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken({ id: staff.id, staffCode: staff.staffCode, name: staff.name, role: 'admin' });

    res.json({
      token,
      user: { id: staff.id, staffCode: staff.staffCode, name: staff.name, role: 'admin' },
    });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/auth/labboy-login ────────────────────────────
const labboyLogin = async (req, res, next) => {
  try {
    const { pin } = z.object({ pin: z.string().min(1) }).parse(req.body);

    const labboys = await prisma.staff.findMany({ where: { role: 'LABBOY' } });

    let matched = null;
    for (const lb of labboys) {
      if (lb.pin && await bcrypt.compare(pin, lb.pin)) {
        matched = lb;
        break;
      }
    }

    if (!matched) return res.status(401).json({ error: 'Invalid PIN' });

    const token = signToken({ id: matched.id, staffCode: matched.staffCode, name: matched.name, role: 'labboy' });

    res.json({
      token,
      user: { id: matched.id, staffCode: matched.staffCode, name: matched.name, role: 'labboy' },
    });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/auth/me ───────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: req.user.id },
      select: { id: true, staffCode: true, name: true, role: true, phone: true },
    });
    if (!staff) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { ...staff, role: staff.role.toLowerCase() } });
  } catch (err) {
    next(err);
  }
};

module.exports = { adminLogin, labboyLogin, getMe };
