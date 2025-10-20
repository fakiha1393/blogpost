import express from "express"
import { getUserProfile, login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAunthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.route("/logout").get(logout);
router.route("/profile").get(isAunthenticated, getUserProfile);
router.route("/profile/update").put(isAunthenticated, upload.single("profilePhoto"),updateProfile);

export default router;