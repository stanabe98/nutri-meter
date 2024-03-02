import express from "express";
import {
  registerUser,
  authUser,
  modifyUser,
  getUser,
  deleteUser
} from "../controllers/userController";
import protect from "../middleware/authUser";

const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/currentuser").get(protect, getUser);

router.route("/currentuser").post(protect, modifyUser);
router.route("/deleteuser").delete(protect, deleteUser);


export default router;
