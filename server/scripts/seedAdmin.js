const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart-assignment-tracker';

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB for Admin seeding.');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@college.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`ℹ️  Admin user already exists with email: ${adminEmail}`);
      existingAdmin.role = 'admin';
      existingAdmin.password = adminPassword;
      await existingAdmin.save();
      console.log(`Updated user ${adminEmail} to admin role with verified password.`);
    } else {
      const adminUser = await User.create({
        fullName: 'Campus Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        department: 'Institutional Administration',
        employeeId: 'ADM-001',
        isActive: true,
      });

      console.log('🎉 Default Administrator account created successfully:');
      console.log(`   Email: ${adminUser.email}`);
      console.log(`   Role: ${adminUser.role}`);
      console.log(`   Password: ${adminPassword}`);
    }

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed Administrator:', error.message);
    process.exit(1);
  }
};

seedAdmin();
