import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURI =
    process.env.MONGODB_URI ||
    "mongodb+srv://shu8hampanwar:RhjAeD8cj52qGkXQ@cluster0.f1nj60c.mongodb.net/";
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
