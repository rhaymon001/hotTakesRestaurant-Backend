import dotenv from "dotenv";
dotenv.config();
const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:3500",
  "http://localhost:5000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.BACKEND_URL,
];
export default allowedOrigins;
