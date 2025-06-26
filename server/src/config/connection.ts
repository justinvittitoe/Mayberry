import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

// Don't log the full connection string for security
console.log(`🔌 Connecting to MongoDB...`);

const connectToDatabase = async (): Promise<typeof mongoose.connection> => {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'PricingModel',
        });
        console.log("✅ Database successfully connected")
        return mongoose.connection;
    } catch (err) {
        console.error("❌ Data connection error: ", err);
        throw new Error("Database connection failed")
    }
}

export default connectToDatabase;
