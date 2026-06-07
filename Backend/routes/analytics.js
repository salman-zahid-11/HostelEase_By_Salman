const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);
router.use(roleCheck(['warden', 'admin']));

// Get complaints over time
router.get('/complaints-over-time', analyticsController.getComplaintsOverTime);

// Get complaints by category
router.get('/by-category', analyticsController.getComplaintsByCategory);

// Get technician performance
router.get('/technician-performance', analyticsController.getTechnicianPerformance);

// Get response time metrics
router.get('/response-time', analyticsController.getResponseTime);

module.exports = router;
