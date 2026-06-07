const User = require('../models/User');

// @desc    Get pending approvals
// @route   GET /api/users/pending-approval
// @access  Private (Admin)
exports.getPendingApproval = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      isApproved: false,
      role: { $in: ['warden', 'technician'] },
    }).select('-password');

    res.status(200).json({
      success: true,
      data: pendingUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending users',
      error: error.message,
    });
  }
};

// @desc    Approve user
// @route   PATCH /api/users/:id/approve
// @access  Private (Admin)
exports.approveUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isApproved = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving user',
      error: error.message,
    });
  }
};

// @desc    Reject user
// @route   PATCH /api/users/:id/reject
// @access  Private (Admin)
exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User rejected and deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting user',
      error: error.message,
    });
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    let query = {};
    if (role) query.role = role;

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// @desc    Assign hostel to warden
// @route   PATCH /api/users/:id/assign-hostel
// @access  Private (Admin)
exports.assignHostel = async (req, res) => {
  try {
    const { hostelAssignment } = req.body;

    if (!hostelAssignment || !['boys', 'girls', 'staff', 'none'].includes(hostelAssignment)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid hostel assignment. Must be boys, girls, staff, or none.',
      });
    }

    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role !== 'warden') {
      return res.status(400).json({
        success: false,
        message: 'Only wardens can be assigned to a hostel.',
      });
    }

    if (!user.wardenDetails) {
      user.wardenDetails = {};
    }
    user.wardenDetails.hostelAssignment = hostelAssignment;
    
    user.markModified('wardenDetails');
    await user.save();

    res.status(200).json({
      success: true,
      message: `Warden assigned to ${hostelAssignment} hostel successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning hostel to warden',
      error: error.message,
    });
  }
};
