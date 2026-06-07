const Complaint = require('../models/Complaint');

const generateComplaintId = async () => {
  try {
    // Find the highest complaint number
    const lastComplaint = await Complaint.findOne()
      .sort({ complaintId: -1 })
      .select('complaintId');

    let nextNumber = 1;
    if (lastComplaint) {
      const lastNumber = parseInt(lastComplaint.complaintId.substring(1));
      nextNumber = lastNumber + 1;
    }

    // Pad with zeros (e.g., C001, C002, ..., C999)
    const complaintId = `C${String(nextNumber).padStart(3, '0')}`;
    return complaintId;
  } catch (error) {
    throw new Error(`Error generating complaint ID: ${error.message}`);
  }
};

module.exports = generateComplaintId;
