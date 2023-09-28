import mongoose from "mongoose";
import moment from "moment";
const schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likeCounts: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Number,
    required: true,
    default: () => moment().unix(),
  },
  createdAt: {
    type: Number,
    required: true,
    default: () => moment().unix(),
  },
});
schema.pre("save", function (next) {
  if (this.isNew) {
    this.createdAt = moment().unix();
  }
  this.updatedAt = moment().unix();
  return next();
});
schema.pre("updateOne", function (next) {
  this.set({ updatedAt: moment().unix() });
  next();
});

export const Tweet = mongoose.model("Tweet", schema);
