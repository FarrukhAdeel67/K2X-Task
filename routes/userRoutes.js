import express from "express";
import {
  followUser,
  getAnotherProfile,
  getMyProfile,
  login,
  register,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authenticateUser.js";
import tweetRouter from "../routes/tweetRoutes.js";
import { getUserTweets } from "../controllers/tweetController.js";
const router = express.Router();

router.route("/register").post(register); //register user
router.route("/login").post(login); //login user
router.route("/me/:id").get(isAuthenticated, getMyProfile); //get my profile
router.route("/me/:id/user/:userId").get(isAuthenticated, getAnotherProfile); //get another user profile
router.route("/me/:id/user/:userId/follow").post(isAuthenticated, followUser); //follow user
router.route("/me/:id/user/:userId/tweets").get(isAuthenticated, getUserTweets); //get tweets of following user
router.use("/me/:id/tweets", isAuthenticated, tweetRouter);

export default router;
