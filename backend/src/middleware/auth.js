/* ============================================================
   JWT Authentication Middleware
   ============================================================ */
const jwt = require('jsonwebtoken');

/**
 * Verifies the JWT from the Authorization header.
 * Attaches the decoded payload to req.user.
 */
const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized — no token provided' });
  }

  const token = header.slice(7);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized — invalid or expired token' });
  }
};

/**
 * Restricts a route to a specific role.
 * Must be used AFTER authenticate().
 */
const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ error: `Forbidden — requires role: ${role}` });
  }
  next();
};

module.exports = { authenticate, requireRole };
