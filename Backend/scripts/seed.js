require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const generateComplaintId = require('../utils/generateComplaintId');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Complaint.deleteMany({});

    console.log('Creating seed data...');

    // Create admin user
    const admin = new User({
      fullName: 'Admin User',
      email: 'admin@hostelenase.com',
      password: 'admin123',
      phoneNumber: '9999999999',
      department: 'Administration',
      role: 'admin',
      isApproved: true,
    });
    await admin.save();

    // Create warden users
    const warden1 = new User({
      fullName: 'Dr. Rajesh Kumar',
      email: 'rajesh.warden@hostelenase.com',
      password: 'warden123',
      phoneNumber: '9876543210',
      department: 'Hostel Administration',
      role: 'warden',
      isApproved: true,
      wardenDetails: {
        employeeId: 'W001',
        officeDepartment: 'Block A',
      },
    });
    await warden1.save();

    const warden2 = new User({
      fullName: 'Ms. Priya Sharma',
      email: 'priya.warden@hostelenase.com',
      password: 'warden123',
      phoneNumber: '9876543211',
      department: 'Hostel Administration',
      role: 'warden',
      isApproved: true,
      wardenDetails: {
        employeeId: 'W002',
        officeDepartment: 'Block B',
      },
    });
    await warden2.save();

    // Create technician users
    const technician1 = new User({
      fullName: 'Ravi Kumar',
      email: 'ravi.tech@hostelenase.com',
      password: 'tech123',
      phoneNumber: '9876543212',
      department: 'Maintenance',
      role: 'technician',
      isApproved: true,
      technicianDetails: {
        specialization: 'Plumbing',
        isAvailable: true,
      },
    });
    await technician1.save();

    const technician2 = new User({
      fullName: 'Vikram Singh',
      email: 'vikram.tech@hostelenase.com',
      password: 'tech123',
      phoneNumber: '9876543213',
      department: 'Maintenance',
      role: 'technician',
      isApproved: true,
      technicianDetails: {
        specialization: 'Electrical',
        isAvailable: true,
      },
    });
    await technician2.save();

    // Create student users
    const student1 = new User({
      fullName: 'Akshit Verma',
      email: 'akshit.verma@student.com',
      password: 'student123',
      phoneNumber: '9876543214',
      department: 'Computer Science',
      role: 'student',
      isApproved: true,
      studentDetails: {
        studentId: 'CS2021001',
        block: 'A',
        roomNumber: '101',
      },
    });
    await student1.save();

    const student2 = new User({
      fullName: 'Neha Patel',
      email: 'neha.patel@student.com',
      password: 'student123',
      phoneNumber: '9876543215',
      department: 'Electronics',
      role: 'student',
      isApproved: true,
      studentDetails: {
        studentId: 'EC2021002',
        block: 'B',
        roomNumber: '205',
      },
    });
    await student2.save();

    const student3 = new User({
      fullName: 'Rohan Singh',
      email: 'rohan.singh@student.com',
      password: 'student123',
      phoneNumber: '9876543216',
      department: 'Mechanical',
      role: 'student',
      isApproved: true,
      studentDetails: {
        studentId: 'ME2021003',
        block: 'A',
        roomNumber: '102',
      },
    });
    await student3.save();

    // Create sample complaints
    const complaint1 = new Complaint({
      complaintId: 'C001',
      studentId: student1._id,
      title: 'Water tap leaking in washroom',
      description: 'The water tap in Block A, Room 101 washroom is continuously leaking',
      category: 'plumbing',
      urgency: 'high',
      status: 'resolved',
      location: {
        block: 'A',
        roomNumber: '101',
      },
      assignedTo: technician1._id,
      assignedByName: warden1._id,
      statusTimeline: [
        {
          status: 'pending',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          note: 'Complaint submitted',
          updatedBy: student1._id,
        },
        {
          status: 'assigned',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          note: 'Assigned to Ravi Kumar',
          updatedBy: warden1._id,
        },
        {
          status: 'in_progress',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          note: 'Repair work started',
          updatedBy: technician1._id,
        },
        {
          status: 'resolved',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          note: 'Tap replaced successfully',
          updatedBy: technician1._id,
        },
      ],
      resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      studentFeedback: {
        rating: 5,
        comment: 'Great work, problem solved quickly!',
        givenAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    });
    await complaint1.save();

    const complaint2 = new Complaint({
      complaintId: 'C002',
      studentId: student2._id,
      title: 'Ceiling fan not working',
      description: 'The ceiling fan in Block B, Room 205 is not rotating',
      category: 'electrical',
      urgency: 'medium',
      status: 'in_progress',
      location: {
        block: 'B',
        roomNumber: '205',
      },
      assignedTo: technician2._id,
      assignedByName: warden2._id,
      statusTimeline: [
        {
          status: 'pending',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          note: 'Complaint submitted',
          updatedBy: student2._id,
        },
        {
          status: 'assigned',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          note: 'Assigned to Vikram Singh',
          updatedBy: warden2._id,
        },
        {
          status: 'in_progress',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          note: 'Technician inspecting the fan',
          updatedBy: technician2._id,
        },
      ],
    });
    await complaint2.save();

    const complaint3 = new Complaint({
      complaintId: 'C003',
      studentId: student3._id,
      title: 'Broken window pane',
      description: 'Window pane in Block A, Room 102 is cracked',
      category: 'structural',
      urgency: 'high',
      status: 'pending',
      location: {
        block: 'A',
        roomNumber: '102',
      },
      statusTimeline: [
        {
          status: 'pending',
          timestamp: new Date(),
          note: 'Complaint submitted',
          updatedBy: student3._id,
        },
      ],
    });
    await complaint3.save();

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('\n👨‍💼 Admin:');
    console.log('  Email: admin@hostelenase.com');
    console.log('  Password: admin123');
    console.log('\n👨‍⚖️ Warden:');
    console.log('  Email: rajesh.warden@hostelenase.com');
    console.log('  Password: warden123');
    console.log('\n👨‍🔧 Technician:');
    console.log('  Email: ravi.tech@hostelenase.com');
    console.log('  Password: tech123');
    console.log('\n👨‍🎓 Student:');
    console.log('  Email: akshit.verma@student.com');
    console.log('  Password: student123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedDatabase();
});
