import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import errorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";
import { ObjectId } from "mongodb";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return next(new errorHandler("Invalid user ID", 400));
  }
  const token =
    req.header("Authorization") && req.header("Authorization").split(" ")[1];
  if (!token) {
    return next(new errorHandler("Authorization Header required", 400));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new errorHandler("User Not Found", 404));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const hexString = user._id.toHexString();
  if (hexString !== decoded._id) {
    return next(new errorHandler("Invalid Token", 401));
  }
  req.user = user;
  next();
});
