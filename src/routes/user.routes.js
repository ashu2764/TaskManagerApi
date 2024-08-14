import { Router } from "express";
import {
  login,
  registerUser,
  logOutUser,
  refreshAccessToken,
} from "../controllers/user.contoller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(login);

//secured routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
