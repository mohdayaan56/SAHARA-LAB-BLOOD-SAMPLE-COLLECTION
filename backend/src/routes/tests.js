const router = require('express').Router();
const { getAllTests, getTest } = require('../controllers/testController');

router.get('/',    getAllTests);
router.get('/:id', getTest);

module.exports = router;
