import mongoose from 'mongoose';

export async function connectMongoDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  return mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB');
}