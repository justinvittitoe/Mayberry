import mongoose from 'mongoose';
import db from '../config/connection.js';
import User from '../models/User.js';

async function createAdminUser() {
  try {
    // Connect to database
    await db();
    console.log('Connected to database');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@mayberry.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@mayberry.com',
      password: 'admin123', // This will be hashed by the User model
      role: 'admin'
    });

    await adminUser.save();

    console.log('Admin user created successfully!');
    console.log('Email: admin@mayberry.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser()
    .then(() => {
      console.log('Admin creation process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Admin creation process failed:', error);
      process.exit(1);
    });
}

export default createAdminUser;