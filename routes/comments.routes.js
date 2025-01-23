const express = require("express");
const mongoose = require("mongoose");
const Comment = require("../models/Comment.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

const router = express.Router();
// ADD route for pinned comments!

router.get("/blog/:blogPostId", async (req, res, next) => {
  const { blogPostId } = req.params;
  if (isValidObjectId(blogPostId)) {
    try {
      const comments = await Comment.find({ blogPostId }).populate(
        "userId",
        "username"
      );
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ message: "Invalid blog ID" });
  }
});

/* GEt route to edit your  comment */

// Add a comment
router.post("/", isAuthenticated, async (req, res, next) => {
  const { blogPostId, content } = req.body;
  const userId = req.tokenPayload.userId;
  try {
    const newComment = await Comment.create({ blogPostId, userId, content });
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

router.delete("/:commentId", isAuthenticated, async (req, res, next) => {
  const { commentId } = req.params;
  if (isValidObjectId(commentId)) {
    try {
      const commentToDelete = await Comment.findById(commentId);
      if (commentToDelete) {
        if (commentToDelete.userId.toString() === req.tokenPayload.userId) {
          await Comment.findByIdAndDelete(commentId);
          res.status(204).send();
        } else {
          res
            .status(403)
            .json({ message: "You cannot delete a comment you didn't create" });
        }
      } else {
        res.status(404).json({ message: "Comment not found" });
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ message: "Invalid comment ID" });
  }
});

module.exports = router;
