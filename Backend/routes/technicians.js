const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.use(authMiddleware);

// Get all technicians (warden can view)
router.get('/', roleCheck(['warden', 'admin']), technicianController.getTechnicians);

// Add technician (admin only)
router.post('/', roleCheck(['admin']), technicianController.addTechnician);

// Update technician (admin only)
router.put('/:id', roleCheck(['admin']), technicianController.updateTechnician);

// Delete technician (admin only)
router.delete('/:id', roleCheck(['admin']), technicianController.deleteTechnician);

module.exports = router;
