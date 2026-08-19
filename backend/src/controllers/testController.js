/* ============================================================
   Test Controller
   ============================================================ */
const { TEST_CATALOGUE, getTestById } = require('../utils/testCatalogue');

// ── GET /api/tests ─────────────────────────────────────────
const getAllTests = (_req, res) => {
  res.json({ tests: TEST_CATALOGUE });
};

// ── GET /api/tests/:id ─────────────────────────────────────
const getTest = (req, res) => {
  const test = getTestById(req.params.id);
  if (!test) return res.status(404).json({ error: 'Test not found' });
  res.json({ test });
};

module.exports = { getAllTests, getTest };
