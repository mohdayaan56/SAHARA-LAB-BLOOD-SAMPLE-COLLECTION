/* ============================================================
   Staff Controller
   ============================================================ */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const formatStaff = (s) => ({
  id:        s.id,
  staffCode: s.staffCode,
  name:      s.name,
  role:      s.role.toLowerCase(),
  phone:     s.phone,
});

// ── GET /api/staff ─────────────────────────────────────────
const getAllStaff = async (req, res, next) => {
  try {
    const staff = await prisma.staff.findMany({
      select: { id: true, staffCode: true, name: true, role: true, phone: true },
      orderBy: { staffCode: 'asc' },
    });
    res.json({ staff: staff.map(formatStaff) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/staff/labboys ─────────────────────────────────
const getLabBoys = async (req, res, next) => {
  try {
    const labboys = await prisma.staff.findMany({
      where:   { role: 'LABBOY' },
      select:  { id: true, staffCode: true, name: true, role: true, phone: true },
      orderBy: { staffCode: 'asc' },
    });
    res.json({ labboys: labboys.map(formatStaff) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/staff/:id ─────────────────────────────────────
const getStaffById = async (req, res, next) => {
  try {
    const staff = await prisma.staff.findUnique({
      where:  { id: req.params.id },
      select: { id: true, staffCode: true, name: true, role: true, phone: true },
    });
    if (!staff) return res.status(404).json({ error: 'Staff not found' });
    res.json({ staff: formatStaff(staff) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllStaff, getLabBoys, getStaffById };
