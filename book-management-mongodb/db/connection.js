import mongoose from "mongoose";

const connect = async (connectionUrl) => {
  try {
    await mongoose.connect(connectionUrl);
    console.info("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connect;
