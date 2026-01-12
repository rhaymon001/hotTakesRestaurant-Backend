import mongoose from "mongoose";

// Use a global variable to cache the connection across serverless invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Prevents hanging if connection is slow
      maxPoolSize: 1, // Best practice for single-threaded serverless
      minPoolSize: 1,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected!");
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset if connection fails
    throw e;
  }

  return cached.conn;
};

export default connectDB;
