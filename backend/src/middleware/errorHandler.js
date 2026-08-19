/* ============================================================
   Global Error Handler Middleware
   ============================================================ */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  console.error('❌ Error:', err);

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with this value already exists.' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found.' });
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  // Generic
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
};

module.exports = errorHandler;
