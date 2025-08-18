import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

async function connectToDatabase() {
    try {
        const dbUri = process.env.DB_URI || "mongodb://localhost:27017/football";
        
        mongoose.Promise = global.Promise;
        
        await mongoose.connect(dbUri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectToDatabase;