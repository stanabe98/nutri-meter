import express from "express";
import protect from "../middleware/authUser";
import {
  addNewEntry,
  deleteEntry,
  getFoodLog,
  modifyEntry,
  deleteFullEntry,
  getAllFoodLogs,
} from "../controllers/foodLogController";

const router = express.Router();

router.route("/:date").get(protect, getFoodLog);
router.route("/").post(protect, addNewEntry);
router.route("/modify").post(protect, modifyEntry);
router.route("/deletelog").post(protect, deleteEntry);
router.route("/delete").delete(protect, deleteFullEntry);
router.route("/").get(protect, getAllFoodLogs);


export default router;
