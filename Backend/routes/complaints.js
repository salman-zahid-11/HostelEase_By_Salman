const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// All routes require authentication
router.use(authMiddleware);

// Get complaints
router.get('/', complaintController.getComplaints);

// Get dashboard statistics
router.get('/stats/dashboard', complaintController.getDashboardStats);

// Create new complaint (student only)
router.post('/', roleCheck(['student']), complaintController.createComplaint);

// Get single complaint
router.get('/:id', complaintController.getComplaint);

// Update complaint (warden only)
router.put('/:id', roleCheck(['warden']), complaintController.updateComplaint);

// Update status (warden, technician)
router.patch('/:id/status', roleCheck(['warden', 'technician']), complaintController.updateStatus);

// Assign complaint (warden only)
router.patch('/:id/assign', roleCheck(['warden']), complaintController.assignComplaint);

// Add feedback (student only)
router.post('/:id/feedback', roleCheck(['student']), complaintController.addFeedback);

module.exports = router;
