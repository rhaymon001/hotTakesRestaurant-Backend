import {
  getAllfoods,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from "../../controllers/foodItemsController.js";
import express from "express";
import upload from "../../middleware/upload.js";
import verifyRole from "../../middleware/verifyRoles.js";

const router = express.Router();
const verifyAdmin = verifyRole(["admin"]);

router.get("/", getAllfoods);
router.post("/", verifyAdmin, upload.single("image"), createFoodItem);
router.put("/:id", verifyAdmin, upload.single("image"), updateFoodItem);
router.delete("/:id", verifyAdmin, deleteFoodItem);

export default router;
