import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoURI:
    process.env.MONGO_URI ||
    "mongodb+srv://shivampandey:KWnj5jdtgcPglj2p@cluster0.2lddy.mongodb.net/",
  jwtSecret: process.env.JWT_SECRET || "fallback_secret",
};

export default config;
