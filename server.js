import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
import credentials from "./middleware/credentials.js";
import corsOptions from "./config/corsOptions.js";
import mongoose from "mongoose";
import connectDB from "./config/dbConn.js";
import registerRoute from "./routes/register.js";
import loginRoute from "./routes/login.js";
import refreshRoute from "./routes/refresh.js";
import logoutRoute from "./routes/logout.js";
import foodItemsRoute from "./routes/api/foodItems.js";
import cookieParser from "cookie-parser";
import verifyJWT from "./middleware/verifyJWT.js";
const PORT = process.env.PORT || 3500;

//connect to DB
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

//built in middleware for json
app.use(express.json());

//cookie-parser middle ware
app.use(cookieParser());
//routes
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/refresh", refreshRoute);
app.use("/logout", logoutRoute);

//middleware for JWT verification
app.use(verifyJWT);
app.use("/foods", foodItemsRoute);
mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
