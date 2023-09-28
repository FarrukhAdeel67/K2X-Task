import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Tweet } from "../models/Tweet.js";
import { ObjectId } from "mongodb";
import errorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";

//new tweet by the user
export const newTweet = catchAsyncError(async (req, res, next) => {
  const { text } = req.body;
  if (!text)
    return next(new errorHandler("Required Field cannot be empty", 400));

  let { user } = req;
  const newTweet = await Tweet.create({
    text,
    author: user._id,
  });

  user.tweets.push(newTweet._id);
  await user.save();

  res.status(200).json({
    success: true,
    message: "tweet posted sucessfully!",
    newTweet,
  });
});

//like the tweet
export const likeTweet = catchAsyncError(async (req, res, next) => {
  const { user } = req;
  const { tweetId } = req.params;

  if (!ObjectId.isValid(tweetId)) {
    return next(new errorHandler("Invalid Tweet ID", 400));
  }
  const existingTweet = await Tweet.findById(tweetId);

  if (!existingTweet) {
    return next(new errorHandler("Tweet not found", 404));
  }

  if (existingTweet.likes.includes(user._id)) {
    return next(new errorHandler("User has already liked this tweet", 400));
  }

  existingTweet.likes.push(user._id);
  existingTweet.likeCounts += 1;
  await existingTweet.save();

  res.status(200).json({
    success: true,
    message: "Tweet liked successfully",
    tweet: existingTweet,
  });
});

// get all my tweets
export const getMyTweets = catchAsyncError(async (req, res, next) => {
  const { user } = req;

  try {
    const userTweets = await Tweet.find({ author: user._id });

    if (!userTweets) {
      return next(new errorHandler("No tweets found for this user", 404));
    }

    res.status(200).json({
      success: true,
      message: "User's tweets retrieved successfully",
      tweets: userTweets,
    });
  } catch (error) {
    next(error);
  }
});

//get all tweets: timeline
export const getAllTweets = catchAsyncError(async (req, res, next) => {
  const tweets = await Tweet.find();
  res.status(200).json({
    success: true,
    message: "Timeline: all the tweets",
    tweets,
  });
});
//get single tweet with details
export const getSingleTweet = catchAsyncError(async (req, res, next) => {
  const { tweetId } = req.params;

  if (!ObjectId.isValid(tweetId)) {
    return next(new errorHandler("Invalid Tweet ID", 400));
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    return next(new errorHandler("Tweet not found", 404));
  }

  const tweetWithDetails = {
    _id: tweet._id,
    text: tweet.text,
    likesCount: tweet.likeCounts,
    author: {
      _id: req.user._id,
      name: req.user.name,
    },
  };

  res.status(200).json({
    success: true,
    message: "Tweet retrieved successfully",
    tweet: tweetWithDetails,
  });
});

//delete the tweet
export const deleteTweet = catchAsyncError(async (req, res, next) => {
  const { tweetId } = req.params;
  const { user } = req;

  if (!ObjectId.isValid(tweetId)) {
    return next(new errorHandler("Invalid Tweet ID", 400));
  }
  const tweetToDelete = await Tweet.findById(tweetId);

  if (!tweetToDelete) {
    return next(new errorHandler("Tweet not found", 404));
  }
  if (tweetToDelete.author.toString() !== user._id.toString()) {
    return next(
      new errorHandler("You are not authorized to delete this tweet", 403)
    );
  }

  const deletedTweet = await Tweet.findByIdAndRemove(tweetId);
  if (deletedTweet) {
    await User.findByIdAndUpdate(user._id, {
      $pull: { tweets: tweetId },
    });
  }

  res.status(200).json({
    success: true,
    message: "Tweet deleted successfully",
    deletedTweet,
  });
});

// get tweets of following user
export const getUserTweets = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    return next(new errorHandler("Invalid User ID", 400));
  }
  const { user } = req;

  try {
    if (!user.following.includes(userId)) {
      return next(new errorHandler("You are not following this user", 403));
    }

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return next(new errorHandler("User not found", 404));
    }

    const userTweets = await Tweet.find({ author: targetUser._id });

    res.status(200).json({
      success: true,
      message: "User's tweets retrieved successfully",
      tweets: userTweets,
    });
  } catch (error) {
    next(error);
  }
});
