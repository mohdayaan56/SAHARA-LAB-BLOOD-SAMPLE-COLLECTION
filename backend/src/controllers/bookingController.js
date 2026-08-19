/* ============================================================
   Booking Controller
   ============================================================ */
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { generateBookingId } = require('../utils/idGenerator');

const prisma = new PrismaClient();

// ── Helper: shape a Prisma booking into the frontend format ─
const formatBooking = (b) => ({
  id:            b.id,
  createdAt:     b.createdAt,
  status:        b.status.toLowerCase(),
  patient: {
    name:    b.patientName,
    phone:   b.patientPhone,
    address: b.patientAddress,
    age:     b.patientAge,
    gender:  b.patientGender.toLowerCase(),
  },
  preferredDate:   b.preferredDate,
  preferredTime:   b.preferredTime,
  notes:           b.notes,
  assignedTo:      b.staff?.staffCode  || b.assignedTo || null,
  assignedStaffId: b.staff?.id         || b.assignedTo || null,
  assignedStaffCode: b.staff?.staffCode || null,
  assignedName:    b.staff?.name       || null,
  tests:           b.tests?.map(t => t.testId) || [],
  collectionNotes: b.collectionNotes,
  collectedAt:     b.collectedAt,
  report:          b.report ? {
    results:    b.report.results,
    remarks:    b.report.remarks,
    reportedBy: b.report.reportedBy,
    reportedAt: b.report.reportedAt,
  } : null,
});

const INCLUDE = {
  staff:  { select: { id: true, staffCode: true, name: true } },
  tests:  true,
  report: true,
};

// ── POST /api/bookings ─────────────────────────────────────
const createBooking = async (req, res, next) => {
  try {
    const data = z.object({
      name:    z.string().min(2),
      phone:   z.string().min(10),
      address: z.string().min(5),
      date:    z.string().min(1),
      time:    z.string().min(1),
      age:     z.string().optional().default(''),
      gender:  z.enum(['male', 'female', 'unknown']).optional().default('unknown'),
      notes:   z.string().optional().default(''),
    }).parse(req.body);

    const id = await generateBookingId();

    const booking = await prisma.booking.create({
      data: {
        id,
        patientName:    data.name,
        patientPhone:   data.phone,
        patientAddress: data.address,
        patientAge:     data.age,
        patientGender:  data.gender.toUpperCase(),
        preferredDate:  data.date,
        preferredTime:  data.time,
        notes:          data.notes,
        status:         'BOOKED',
      },
      include: INCLUDE,
    });

    res.status(201).json({ booking: formatBooking(booking) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/bookings ──────────────────────────────────────
const getAllBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status: status.toUpperCase() } : {};

    const bookings = await prisma.booking.findMany({
      where,
      include: INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ bookings: bookings.map(formatBooking) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/bookings/my ────────────────────────────────────
const getMyBookings = async (req, res, next) => {
  try {
    const staffId = req.user.id;
    const staff = await prisma.staff.findUnique({ where: { id: staffId } });
    const staffCode = staff?.staffCode;

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { assignedTo: staffId },
          ...(staffCode ? [{ assignedTo: staffCode }] : []),
          { assignedTo: null },
          { status: 'BOOKED' },
        ],
      },
      include: INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ bookings: bookings.map(formatBooking) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/bookings/search ────────────────────────────────
const searchBookings = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ bookings: [] });

    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { id:           { contains: q, mode: 'insensitive' } },
          { patientName:  { contains: q, mode: 'insensitive' } },
          { patientPhone: { contains: q } },
        ],
      },
      include: INCLUDE,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ bookings: bookings.map(formatBooking) });
  } catch (err) {
    next(err);
  }
};

// ── GET /api/bookings/:id ──────────────────────────────────
const getBooking = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where:   { id: req.params.id.toUpperCase() },
      include: INCLUDE,
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ booking: formatBooking(booking) });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/bookings/:id/assign ─────────────────────────
const assignBooking = async (req, res, next) => {
  try {
    const { staffId, testIds } = z.object({
      staffId: z.string().min(1),
      testIds: z.array(z.string()).min(1),
    }).parse(req.body);

    // Verify staff exists (by CUID id or staffCode)
    const staff = await prisma.staff.findFirst({
      where: {
        OR: [
          { id: staffId },
          { staffCode: staffId },
        ],
      },
    });
    if (!staff) return res.status(404).json({ error: 'Staff not found' });

    // Replace tests
    await prisma.bookingTest.deleteMany({ where: { bookingId: req.params.id } });

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        assignedTo: staff.id,
        status:     'ASSIGNED',
        tests: {
          create: testIds.map(testId => ({ testId })),
        },
      },
      include: INCLUDE,
    });

    res.json({ booking: formatBooking(booking) });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/bookings/:id/collect ────────────────────────
const collectSample = async (req, res, next) => {
  try {
    const { collectionNotes, testIds } = z.object({
      collectionNotes: z.string().optional().default(''),
      testIds:         z.array(z.string()).optional(),
    }).parse(req.body);

    if (testIds && testIds.length > 0) {
      await prisma.bookingTest.deleteMany({ where: { bookingId: req.params.id } });
    }

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        status:          'COLLECTED',
        collectionNotes,
        collectedAt:     new Date(),
        ...(testIds && testIds.length > 0 ? {
          tests: {
            create: testIds.map(testId => ({ testId })),
          },
        } : {}),
      },
      include: INCLUDE,
    });

    res.json({ booking: formatBooking(booking) });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/bookings/:id/process ────────────────────────
const markProcessing = async (req, res, next) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data:  { status: 'PROCESSING' },
      include: INCLUDE,
    });
    res.json({ booking: formatBooking(booking) });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/bookings/:id/report ─────────────────────────
const saveReport = async (req, res, next) => {
  try {
    const data = z.object({
      results:    z.array(z.any()).min(1),
      remarks:    z.string().optional().default(''),
      reportedBy: z.string().min(1),
    }).parse(req.body);

    // Upsert report
    await prisma.report.upsert({
      where:  { bookingId: req.params.id },
      update: { results: data.results, remarks: data.remarks, reportedBy: data.reportedBy, reportedAt: new Date() },
      create: { bookingId: req.params.id, results: data.results, remarks: data.remarks, reportedBy: data.reportedBy },
    });

    const booking = await prisma.booking.update({
      where:   { id: req.params.id },
      data:    { status: 'READY' },
      include: INCLUDE,
    });

    res.json({ booking: formatBooking(booking) });
  } catch (err) {
    next(err);
  }
};

// ── PATCH /api/bookings/:id ─────────────────────────────────
const updateBooking = async (req, res, next) => {
  try {
    const allowed = ['notes', 'preferredDate', 'preferredTime', 'status', 'assignedTo', 'collectionNotes'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (updates.status) updates.status = updates.status.toUpperCase();
    if (updates.assignedTo) {
      const staff = await prisma.staff.findFirst({
        where: {
          OR: [
            { id: updates.assignedTo },
            { staffCode: updates.assignedTo },
          ],
        },
      });
      if (staff) updates.assignedTo = staff.id;
    }

    const booking = await prisma.booking.update({
      where:   { id: req.params.id },
      data:    updates,
      include: INCLUDE,
    });

    res.json({ booking: formatBooking(booking) });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking, getAllBookings, getMyBookings, searchBookings,
  getBooking, assignBooking, collectSample, markProcessing, saveReport, updateBooking,
};
