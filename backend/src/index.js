/* ============================================================
   SAHARA LAB — Express Entry Point
   ============================================================ */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const authRoutes      = require('./routes/auth');
const bookingRoutes   = require('./routes/bookings');
const staffRoutes     = require('./routes/staff');
const testRoutes      = require('./routes/tests');
const analyticsRoutes = require('./routes/analytics');

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/staff',    staffRoutes);
app.use('/api/tests',    testRoutes);
app.use('/api/patient',  analyticsRoutes);

// ── 404 ────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Global error handler ───────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🧪 Sahara Lab API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
