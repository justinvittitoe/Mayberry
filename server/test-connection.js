import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

console.log('Testing MongoDB connection...');

async function testConnection() {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'PricingModel',
        });
        console.log('✅ MongoDB connection successful!');

        // Test a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📚 Available collections:', collections.map(c => c.name));

        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

testConnection(); 