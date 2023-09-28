import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import errorHandler from "../utils/errorHandler.js";
import { ObjectId } from "mongodb";

//register user
export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return next(new errorHandler("Required Fields cannot be empty", 400));
  let user = await User.findOne({
    email,
  });
  if (user) return next(new errorHandler("User already Exist", 409));

  user = await User.create({
    name,
    email,
    password,
  });
  user.password = undefined;
  const token = user.getJWTToken();
  res.status(200).json({
    success: true,
    message: "User created successfully!",
    user,
    token,
  });
});

//login  user
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new errorHandler("Required Fields cannot be empty", 400));
  let user = await User.findOne({
    email,
  }).select("+password");
  if (!user) return next(new errorHandler("Incorrect Email or Password", 401));
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new errorHandler("Incorrect Email or Password", 401));
  }
  const token = user.getJWTToken();
  res.status(200).json({
    success: true,
    message: "User logged In successfully!",
    user,
    token,
  });
});

//follow the user
export const followUser = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;

  if (!ObjectId.isValid(userId)) {
    return next(new errorHandler("Invalid Tweet ID", 400));
  }

  const { user } = req;

  try {
    if (user.following.includes(userId)) {
      return next(new errorHandler("You are already following this user", 400));
    }
    user.following.addToSet(userId);

    await user.save();

    const targetUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { followers: user._id } },
      { new: true }
    );

    if (!targetUser) {
      return next(new errorHandler("Target user not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User followed successfully!",
      user: targetUser,
    });
  } catch (error) {
    next(error);
  }
});

//get my  profile
export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("tweets");

  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  const followerCount = user.followers.length;

  const followedCount = user.following.length;

  const userTweets = user.tweets;

  const userProfile = {
    _id: user._id,
    username: user.username,
    name: user.name,
    followerCount,
    followedCount,
    tweets: userTweets,
    followers: user.followers,
    following: user.following,
  };

  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    profile: userProfile,
  });
});

//see another user profile
export const getAnotherProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("tweets");

  if (!user) {
    return next(new errorHandler("User not found", 404));
  }

  const followerCount = user.followers.length;

  const followedCount = user.following.length;

  const userTweets = user.tweets;

  const userProfile = {
    _id: user._id,
    username: user.username,
    name: user.name,
    followerCount,
    followedCount,
    tweets: userTweets,
  };

  res.status(200).json({
    success: true,
    message: "User profile retrieved successfully",
    profile: userProfile,
  });
});
