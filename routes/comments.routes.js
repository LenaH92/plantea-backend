const express = require("express");
const mongoose = require("mongoose");
const Comment = require("../models/Comment.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const Blog = require("../models/Blog.model");

const router = express.Router();
// ADD route for pinned comments!


//I'm leaving thih here but if in the future we need to use it, we better move it to blog routes :)


/* router.get("/blog/:blogPostId", async (req, res, next) => {
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
}); */

/* GEt route to edit your  comment */

// Add a comment
/* router.post("/", isAuthenticated, async (req, res, next) => {
  const { blogPostId, content } = req.body;
  const userId = req.tokenPayload.userId;
  try {
    const newComment = await Comment.create({ blogPostId, userId, content });
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
}); */
/* post a comment
 */
router.post("/", isAuthenticated, async (req, res, next) => {
  const { blogPostId, content } = req.body;
  const userId = req.tokenPayload.userId;

  // Validationg the blog exists
  if (!mongoose.isValidObjectId(blogPostId)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  try {
    // finding the blog it'll be bound to
    const blog = await Blog.findById(blogPostId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const newComment = await Comment.create({ blogPostId, userId, content });
    await newComment.populate("userId", "username profilePicture");

    blog.comments.unshift(newComment._id);// Addding the comment to the array on the blog ddocuemnt
    await blog.save();

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

/* route to edit your own comment */

router.put("/:commentId", isAuthenticated, async (req, res, next) => {
  const { commentId } = req.params;
  if (mongoose.isValidObjectId(commentId)) {
    try {
      const commentToEdit = await Comment.findById(commentId);
      if (commentToEdit) {
        if (commentToEdit.userId.toString() === req.tokenPayload.userId) {
          const updatedComment = await Comment.findByIdAndUpdate(commentId, req.body, {
            new: true,
            runValidators: true,
          });
          res.json(updatedComment)
        } else {
          res.status(403).json({ message: "you cannot edit a comment you didn't make" })
        }
      } else {
        res.status(404).json({ message: "Comment not found" })
      }
    } catch (error) {
      console.log(error);
      next(error)
    }
  } else {
    res.status(400).json({ message: "Invalid comment ID" });
  }
})



/* Delete a comment */
router.delete("/:commentId", isAuthenticated, async (req, res, next) => {
  const { commentId } = req.params;
  if (mongoose.isValidObjectId(commentId)) {
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
