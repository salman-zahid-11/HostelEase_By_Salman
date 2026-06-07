const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');
const generateComplaintId = require('../utils/generateComplaintId');
const sendEmail = require('../utils/sendEmail');

// @desc    Get complaints (filtered by role)
// @route   GET /api/complaints
// @access  Private
// @desc    Get complaints (filtered by role)
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
  try {
    const { status, category, urgency, block, page = 1, limit = 10 } = req.query;
    const user = req.user;

    let query = {};

    // Filter based on user role
    if (user.role === 'student') {
      query.studentId = user._id;
    }

    // Apply additional filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (urgency) query.urgency = urgency;
    if (block) query['location.block'] = block;

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(query)
      .populate('studentId', 'fullName email phoneNumber studentDetails')
      .populate('assignedTo', 'fullName email phoneNumber technicianDetails')
      .populate('assignedByName', 'fullName email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Complaint.countDocuments(query);

    res.status(200).json({
      success: true,
      data: complaints,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints',
      error: error.message,
    });
  }
};

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private (Student)
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, urgency, images, location } = req.body;
    const studentId = req.user._id;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and category',
      });
    }

    // Get student details
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found',
      });
    }

    // Generate unique complaint ID
    const complaintId = await generateComplaintId();

    // Create complaint
    const complaint = new Complaint({
      complaintId,
      studentId,
      title,
      description,
      category,
      urgency: urgency || 'medium',
      images: images || [],
      location: {
        block: location?.block || student.studentDetails?.block || '',
        roomNumber: location?.roomNumber || student.studentDetails?.roomNumber || '',
      },
      statusTimeline: [
        {
          status: 'pending',
          timestamp: new Date(),
          note: 'Complaint submitted',
          updatedBy: studentId,
        },
      ],
    });

    await complaint.save();

    // Notify wardens
    const wardens = await User.find({ role: 'warden', isApproved: true });
    const notificationPromises = wardens.map((warden) =>
      Notification.create({
        userId: warden._id,
        title: 'New Complaint',
        message: `New complaint: ${title}`,
        type: 'complaint_update',
        relatedComplaintId: complaint._id,
      })
    );

    await Promise.all(notificationPromises);

    res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating complaint',
      error: error.message,
    });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('studentId', 'fullName email phoneNumber studentDetails')
      .populate('assignedTo', 'fullName email phoneNumber technicianDetails')
      .populate('assignedByName', 'fullName email')
      .populate('statusTimeline.updatedBy', 'fullName role')
      .populate('internalNotes.createdBy', 'fullName role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Check authorization
    if (req.user.role === 'student' && complaint.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this complaint',
      });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaint',
      error: error.message,
    });
  }
};

// @desc    Update complaint (warden only)
// @route   PUT /api/complaints/:id
// @access  Private (Warden)
exports.updateComplaint = async (req, res) => {
  try {
    const { title, description, category, urgency } = req.body;
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Update fields
    if (title) complaint.title = title;
    if (description) complaint.description = description;
    if (category) complaint.category = category;
    if (urgency) complaint.urgency = urgency;

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating complaint',
      error: error.message,
    });
  }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private (Warden, Technician)
exports.updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }

    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const previousStatus = complaint.status;
    complaint.status = status;

    // Add to status timeline
    complaint.statusTimeline.push({
      status,
      timestamp: new Date(),
      note: note || '',
      updatedBy: req.user._id,
    });

    // If resolved, set resolvedAt
    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    // Create notification for student
    await Notification.create({
      userId: complaint.studentId,
      title: 'Complaint Status Updated',
      message: `Your complaint status has been updated to ${status}`,
      type: 'complaint_update',
      relatedComplaintId: complaint._id,
    });

    // Send email to student
    const student = await User.findById(complaint.studentId);
    if (student) {
      const emailHtml = `
        <h2>Complaint Status Updated</h2>
        <p>Your complaint <strong>${complaint.complaintId}</strong> status has been updated to <strong>${status}</strong></p>
        ${note ? `<p><strong>Note:</strong> ${note}</p>` : ''}
      `;
      await sendEmail(student.email, 'Complaint Status Update', emailHtml);
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message,
    });
  }
};

// @desc    Assign complaint to technician
// @route   PATCH /api/complaints/:id/assign
// @access  Private (Warden)
exports.assignComplaint = async (req, res) => {
  try {
    const { technicianId } = req.body;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: 'Technician ID is required',
      });
    }

    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Verify technician exists and is available
    const technician = await User.findById(technicianId);
    if (!technician || technician.role !== 'technician') {
      return res.status(404).json({
        success: false,
        message: 'Technician not found',
      });
    }

    complaint.assignedTo = technicianId;
    complaint.assignedByName = req.user._id;
    complaint.status = 'assigned';

    // Add to status timeline
    complaint.statusTimeline.push({
      status: 'assigned',
      timestamp: new Date(),
      note: `Assigned to ${technician.fullName}`,
      updatedBy: req.user._id,
    });

    await complaint.save();

    // Notify technician
    await Notification.create({
      userId: technicianId,
      title: 'New Assignment',
      message: `You have been assigned complaint: ${complaint.title}`,
      type: 'assignment',
      relatedComplaintId: complaint._id,
    });

    // Notify student
    await Notification.create({
      userId: complaint.studentId,
      title: 'Complaint Assigned',
      message: `Your complaint has been assigned to ${technician.fullName}`,
      type: 'assignment',
      relatedComplaintId: complaint._id,
    });

    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning complaint',
      error: error.message,
    });
  }
};

// @desc    Add student feedback
// @route   POST /api/complaints/:id/feedback
// @access  Private (Student)
exports.addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Only student who created complaint can give feedback
    if (complaint.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to give feedback',
      });
    }

    complaint.studentFeedback = {
      rating,
      comment: comment || '',
      givenAt: new Date(),
    };

    await complaint.save();

    res.status(200).json({
      success: true,
      message: 'Feedback added successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding feedback',
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/complaints/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const user = req.user;
    let query = {};

    if (user.role === 'student') {
      query.studentId = user._id;
    }

    const totalComplaints = await Complaint.countDocuments(query);
    const pendingComplaints = await Complaint.countDocuments({ ...query, status: 'pending' });
    const inProgressComplaints = await Complaint.countDocuments({ ...query, status: 'in_progress' });
    const resolvedComplaints = await Complaint.countDocuments({ ...query, status: 'resolved' });

    res.status(200).json({
      success: true,
      data: {
        total: totalComplaints,
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};
