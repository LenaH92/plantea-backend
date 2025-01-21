const { isValidObjectId } = require("mongoose");
const Blog = require("../models/Blog.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate("userId", "username");
    res.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  const { title, textContent, tags, categories } = req.body;
  const userId = req.tokenPayload.userId;
  try {
    const newBlog = await Blog.create({
      title,
      textContent,
      tags,
      categories,
      userId,
    });
    res.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }
});

router.delete("/:blogId", isAuthenticated, async (req, res, next) => {
  const { blogId } = req.params;
  if (isValidObjectId(blogId)) {
    try {
      const blogToDelete = await Blog.findById(blogId);
      if (blogToDelete) {
        if (blogToDelete.userId.toString() === req.tokenPayload.userId) {
          await Blog.findByIdAndDelete(blogId);
          res.status(204).send();
        } else {
          res
            .status(403)
            .json({ message: "You cannot delete a blog you didn't create" });
        }
      } else {
        res.status(404).json({ message: "Blog not found" });
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ message: "Invalid blog ID" });
  }
});

module.exports = router;
