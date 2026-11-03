import express from "express";
import registerController from "../controllers/registerController.js";
import { registerSchema } from "../validators/register.validators.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

router.post("/", validate(registerSchema), registerController);
export default router;
