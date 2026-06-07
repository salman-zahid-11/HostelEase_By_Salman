const User = require('../models/User');
const { generateToken } = require('../utils/jwtHelper');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, department, role, studentDetails, wardenDetails } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !phoneNumber || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create user object
    const userData = {
      fullName,
      email,
      password,
      phoneNumber,
      department,
      role: role || 'student',
    };

    // Add role-specific details
    if (role === 'student' && studentDetails) {
      userData.studentDetails = studentDetails;
      userData.isApproved = true; // Students auto-approved
    } else if (role === 'warden' && wardenDetails) {
      userData.wardenDetails = wardenDetails;
      userData.isApproved = false; // Wardens require approval
    } else if (role === 'technician') {
      userData.isApproved = false; // Technicians require approval
    }

    // Create user
    user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Send approval email to admin if warden/technician
    if (['warden', 'technician'].includes(role)) {
      const adminEmail = process.env.ADMIN_EMAIL;
      const approvalLink = `http://localhost:3000/admin/approve/${user._id}`;
      
      const html = `
        <h2>New ${role} Registration</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><a href="${approvalLink}">Approve User</a></p>
      `;

      await sendEmail(adminEmail, `New ${role} Registration - Approval Required`, html);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if user is approved (for warden/technician)
    if (!user.isApproved && ['warden', 'technician'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        studentDetails: user.studentDetails,
        wardenDetails: user.wardenDetails,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging out',
      error: error.message,
    });
  }
};
