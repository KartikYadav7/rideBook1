import mongoose from "mongoose";

async function connectDB() {
    try {
       await mongoose.connect(`${process.env.MONGO_URI}`);
        console.log(`MongoDB connected.....`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;