const User = require('../models/User');

// @desc    Get all technicians
// @route   GET /api/technicians
// @access  Private (Warden, Admin)
exports.getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: 'technician', isApproved: true }).select('-password');

    res.status(200).json({
      success: true,
      data: technicians,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching technicians',
      error: error.message,
    });
  }
};

// @desc    Add technician
// @route   POST /api/technicians
// @access  Private (Admin only)
exports.addTechnician = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, department, specialization } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if technician already exists
    let technician = await User.findOne({ email });
    if (technician) {
      return res.status(400).json({
        success: false,
        message: 'Technician already exists',
      });
    }

    // Create technician
    technician = new User({
      fullName,
      email,
      password,
      phoneNumber,
      department: department || 'Maintenance',
      role: 'technician',
      isApproved: true,
      technicianDetails: {
        specialization: specialization || 'General Maintenance',
        isAvailable: true,
      },
    });

    await technician.save();

    res.status(201).json({
      success: true,
      message: 'Technician added successfully',
      data: {
        id: technician._id,
        fullName: technician.fullName,
        email: technician.email,
        specialization: technician.technicianDetails.specialization,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding technician',
      error: error.message,
    });
  }
};

// @desc    Update technician
// @route   PUT /api/technicians/:id
// @access  Private (Admin only)
exports.updateTechnician = async (req, res) => {
  try {
    const { fullName, phoneNumber, specialization, isAvailable } = req.body;

    let technician = await User.findById(req.params.id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found',
      });
    }

    if (fullName) technician.fullName = fullName;
    if (phoneNumber) technician.phoneNumber = phoneNumber;
    if (specialization) technician.technicianDetails.specialization = specialization;
    if (isAvailable !== undefined) technician.technicianDetails.isAvailable = isAvailable;

    await technician.save();

    res.status(200).json({
      success: true,
      message: 'Technician updated successfully',
      data: technician,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating technician',
      error: error.message,
    });
  }
};

// @desc    Delete technician
// @route   DELETE /api/technicians/:id
// @access  Private (Admin only)
exports.deleteTechnician = async (req, res) => {
  try {
    const technician = await User.findByIdAndDelete(req.params.id);

    if (!technician) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Technician deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting technician',
      error: error.message,
    });
  }
};
