/* ============================================================
   Booking ID Generator — SHL-DDMM-XXXX
   Matches the existing frontend format exactly.
   ============================================================ */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generates a unique booking ID in the format: SHL-DDMM-XXXX
 * Retries up to 10 times if a collision occurs.
 */
const generateBookingId = async () => {
  const n   = new Date();
  const d   = String(n.getDate()).padStart(2, '0');
  const m   = String(n.getMonth() + 1).padStart(2, '0');
  const prefix = `SHL-${d}${m}-`;

  for (let attempt = 0; attempt < 10; attempt++) {
    const r  = String(Math.floor(Math.random() * 9000) + 1000);
    const id = `${prefix}${r}`;

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) return id;
  }

  throw new Error('Could not generate a unique booking ID after 10 attempts.');
};

module.exports = { generateBookingId };
