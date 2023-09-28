import express from "express";

import {
  deleteTweet,
  getAllTweets,
  getMyTweets,
  getSingleTweet,
  likeTweet,
  newTweet,
} from "../controllers/tweetController.js";
const router = express.Router();

router.route("/").get(getAllTweets); //get tweets from all users :timeline
router.route("/myTweets").get(getMyTweets); // get all my tweets
router.route("/newTweet").post(newTweet); //post new tweet
router.route("/:tweetId").get(getSingleTweet); // get single tweet with details
router.route("/:tweetId/like").post(likeTweet); //like someones tweet
router.route("/:tweetId/removeTweet").delete(deleteTweet); //delete only your tweet
export default router;
