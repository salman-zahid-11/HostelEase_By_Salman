const Complaint = require('../models/Complaint');

// @desc    Get complaints over time (weekly/monthly trends)
// @route   GET /api/analytics/complaints-over-time
// @access  Private (Warden)
exports.getComplaintsOverTime = async (req, res) => {
  try {
    const { period = 'week' } = req.query; // 'week' or 'month'

    let dateFilter = {};
    const now = new Date();

    if (period === 'week') {
      dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'month') {
      dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
    }

    const complaints = await Complaint.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints over time',
      error: error.message,
    });
  }
};

// @desc    Get complaints by category
// @route   GET /api/analytics/by-category
// @access  Private (Warden)
exports.getComplaintsByCategory = async (req, res) => {
  try {
    const categories = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints by category',
      error: error.message,
    });
  }
};

// @desc    Get technician performance metrics
// @route   GET /api/analytics/technician-performance
// @access  Private (Warden)
exports.getTechnicianPerformance = async (req, res) => {
  try {
    const performance = await Complaint.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      {
        $group: {
          _id: '$assignedTo',
          totalAssigned: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] },
          },
          avgRating: { $avg: '$studentFeedback.rating' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'technicianInfo',
        },
      },
      { $unwind: '$technicianInfo' },
      {
        $project: {
          _id: 0,
          technicianId: '$_id',
          technicianName: '$technicianInfo.fullName',
          specialization: '$technicianInfo.technicianDetails.specialization',
          totalAssigned: 1,
          resolved: 1,
          inProgress: 1,
          avgRating: { $round: ['$avgRating', 2] },
          resolutionRate: {
            $round: [{ $multiply: [{ $divide: ['$resolved', '$totalAssigned'] }, 100] }, 2],
          },
        },
      },
      { $sort: { resolutionRate: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: performance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching technician performance',
      error: error.message,
    });
  }
};

// @desc    Get average response/resolution time
// @route   GET /api/analytics/response-time
// @access  Private (Warden)
exports.getResponseTime = async (req, res) => {
  try {
    const metrics = await Complaint.aggregate([
      {
        $group: {
          _id: null,
          avgResponseTime: {
            $avg: {
              $cond: [
                { $ne: ['$assignedTo', null] },
                {
                  $divide: [
                    { $subtract: ['$statusTimeline.1.timestamp', '$createdAt'] },
                    1000 * 60 * 60, // Convert to hours
                  ],
                },
                0,
              ],
            },
          },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $eq: ['$status', 'resolved'] },
                {
                  $divide: [
                    { $subtract: ['$resolvedAt', '$createdAt'] },
                    1000 * 60 * 60, // Convert to hours
                  ],
                },
                0,
              ],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: metrics[0] || { avgResponseTime: 0, avgResolutionTime: 0 },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching response time metrics',
      error: error.message,
    });
  }
};
