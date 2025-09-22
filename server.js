import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectDB from "./config/dbConn.js";
import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
const PORT = process.env.PORT || 3500;

//connect to DB
connectDB();

//built in middleware for json
app.use(express.json());

//routes
app.use("/register", registerRoute);
app.use("/login", loginRoute);

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
