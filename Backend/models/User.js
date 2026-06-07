const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't return password by default
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    role: {
      type: String,
      enum: ['student', 'warden', 'technician', 'admin'],
      default: 'student',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    studentDetails: {
      studentId: String,
      block: String,
      roomNumber: String,
    },
    wardenDetails: {
      employeeId: String,
      officeDepartment: String,
      hostelAssignment: {
        type: String,
        enum: ['boys', 'girls', 'staff', 'none'],
        default: 'none',
      },
    },
    technicianDetails: {
      specialization: String,
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
    profileImage: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
