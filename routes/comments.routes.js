const express = require("express");
const mongoose = require("mongoose");
const Comment = require("../models/Comment.model");
const Blog = require("../models/Blog.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

const router = express.Router();
// ADD route for pinned comments!

router.get("/blog/:blogPostId", async (req, res, next) => {
  const { blogPostId } = req.params;

  if (mongoose.Types.ObjectId.isValid(blogPostId)) {
    try {
      const comments = await Comment.find({ blogPostId }).populate(
        "userId",
        "name email"
      ); // Populate user info
      res.json(comments);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ message: "Invalid blog ID" });
  }
});

router.post("/", async (req, res, next) => {
  const { blogPostId, userId, content } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(blogPostId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return res.status(400).json({ message: "Invalid blog or user ID" });
  }

  try {
    const blogExists = await Blog.findById(blogPostId);
    const userExists = await User.findById(userId);

    if (!blogExists) return res.status(404).json();
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const newComment = await Comment.create({ blogPostId, userId, content });
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

router.put("/:commentId", async (req, res, next) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: "Invalid comment ID" });
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedComment)
      return res.status(404).json({ message: "Comment not found" });

    res.json(updatedComment);
  } catch (error) {
    next(error);
  }
});

router.delete("/:commentId", async (req, res, next) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    return res.status(400).json({ message: "Invalid comment ID" });
  }

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment)
      return res.status(404).json({ message: "Comment not found" });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
