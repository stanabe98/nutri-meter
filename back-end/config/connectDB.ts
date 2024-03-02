import mongoose, { ConnectOptions } from "mongoose";

export const connectDB = async (url: string) => {
  try {
    const conn = await mongoose.connect(url, {
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};
