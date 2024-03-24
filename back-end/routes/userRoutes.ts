import express from "express";
import {
  registerUser,
  authUser,
  modifyUser,
  getUser,
  deleteUser,
  addSavedFood,
  editSavedFood,
  deleteSavedFood
} from "../controllers/userController";
import protect from "../middleware/authUser";

const router = express.Router();

router.route("/register").post(registerUser);
router.post("/login", authUser);
router.route("/currentuser").get(protect, getUser);

router.route("/currentuser").post(protect, modifyUser);
router.route("/currentuser/food/add").post(protect, addSavedFood);
router.route("/currentuser/food/edit").post(protect, editSavedFood);
router.route("/currentuser/food/delete").post(protect, deleteSavedFood);



router.route("/deleteuser").delete(protect, deleteUser);

export default router;
