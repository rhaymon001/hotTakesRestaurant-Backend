import express from "express";
import loginController from "../controllers/loginController.js";
import { loginSchema } from "../validators/login.validators.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

router.post("/", validate(loginSchema), loginController);
export default router;
