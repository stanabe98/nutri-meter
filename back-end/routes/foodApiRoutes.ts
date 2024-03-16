import express from "express";
import protect from "../middleware/authUser";

import {
  searchFoodbyName,
  getFoodbyId,
  getAccessToken,
} from "../controllers/foodApiController";

const router = express.Router();

router.route("/getaccess").get(getAccessToken);
router.route("/").get(searchFoodbyName);
router.route("/getfood").get(getFoodbyId);

export default router