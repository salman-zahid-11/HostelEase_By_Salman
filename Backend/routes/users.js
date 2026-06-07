const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);
router.use(roleCheck(['admin']));

// Get all users
router.get('/', usersController.getAllUsers);

// Get pending approvals
router.get('/pending-approval', usersController.getPendingApproval);

// Approve user
router.patch('/:id/approve', usersController.approveUser);

// Reject user
router.patch('/:id/reject', usersController.rejectUser);

// Assign hostel
router.patch('/:id/assign-hostel', usersController.assignHostel);

module.exports = router;
