const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAllDemoAccounts = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-assignment-tracker';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB for Demo Accounts Seeding...');

    const accounts = [
      // Quick Demo 1-Click accounts
      {
        fullName: 'Alex Morgan (Demo Student)',
        email: 'student@smarttracker.edu',
        password: 'StudentPass123!',
        role: 'student',
        department: 'Computer Science & Engineering',
        studentId: 'STU-DEMO-01',
        isActive: true,
      },
      {
        fullName: 'Prof. Marcus Vance (Demo Faculty)',
        email: 'teacher@smarttracker.edu',
        password: 'TeacherPass123!',
        role: 'teacher',
        department: 'Computer Science & Engineering',
        employeeId: 'EMP-DEMO-01',
        isActive: true,
      },
      {
        fullName: 'System Administrator (Demo)',
        email: 'admin@smarttracker.edu',
        password: 'AdminPass123!',
        role: 'admin',
        department: 'Institutional Administration',
        employeeId: 'ADM-DEMO-01',
        isActive: true,
      },
      // College accounts
      {
        fullName: 'John Student',
        email: 'john.student@college.edu',
        password: 'Password@123',
        role: 'student',
        department: 'Computer Science & Engineering',
        studentId: 'STU-2026-999',
        isActive: true,
      },
      {
        fullName: 'Dr. Sarah Connor',
        email: 'sarah.teacher@college.edu',
        password: 'Password@123',
        role: 'teacher',
        department: 'Computer Science & Engineering',
        employeeId: 'EMP-CS-101',
        isActive: true,
      },
      {
        fullName: 'Campus Administrator',
        email: 'admin@college.edu',
        password: 'Admin@123456',
        role: 'admin',
        department: 'Institutional Administration',
        employeeId: 'ADM-001',
        isActive: true,
      },
    ];

    for (const acc of accounts) {
      let user = await User.findOne({ email: acc.email });
      if (user) {
        user.password = acc.password;
        user.role = acc.role;
        user.isActive = true;
        user.fullName = acc.fullName;
        user.department = acc.department;
        if (acc.studentId) user.studentId = acc.studentId;
        if (acc.employeeId) user.employeeId = acc.employeeId;
        await user.save();
        console.log(`🔄 Updated existing account: ${acc.email} (${acc.role})`);
      } else {
        await User.create(acc);
        console.log(`✅ Created demo account: ${acc.email} (${acc.role})`);
      }
    }

    console.log('🎉 All Demo Accounts are Verified and Ready!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding demo accounts:', err);
    process.exit(1);
  }
};

seedAllDemoAccounts();
