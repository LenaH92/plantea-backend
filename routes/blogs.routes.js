const mongoose = require("mongoose");
const router = require("express").Router();
const Blog = require("../models/Blog.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

// const Blogs = require("../blog.json???"); //add the file

router.get("/", async (req, res) => {
  try {
    const Blogs = await Blog.find().populate("userId", "firstName surname");
    res.status(200).json(Blogs);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:BlogPostId", async (req, res, next) => {
  const { BlogPostId } = req.params;
  if (mongoose.Types.ObjectId.isValid(BlogPostId)) {
  }
  try {
    const Blog = await Blog.findById(BlogPostId).populate(
      "userId",
      "firstName surname"
    );
    res.status(400).json(Blog);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAuthenticated, async (req, res, next) => {
  const { title, textContent, tags, categories, mediaContent } = req.body;
  const userId = req.tokenPayload.userId;

  try {
    const newBlog = await Blog.create({
      title,
      userId,
      textContent,
      tags,
      categories,
      mediaContent,
    });
    res.status(201).json(newBlog);
  } catch (error) {
    next(error);
  }
});

// PUT a blog by ID (Protected)
router.put("/:BlogPostId", isAuthenticated, async (req, res, next) => {
  const { BlogPostId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(BlogPostId)) {
    return res.status(400).json({ message: "Invalid Blog ID." });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(BlogPostId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

// DELETE a blog by ID (Protected)
router.delete("/:BlogPostId", isAuthenticated, async (req, res, next) => {
  const { BlogPostId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(BlogPostId)) {
    return res.status(400).json({ message: "Invalid Blog ID." });
  }

  try {
    const deletedBlog = await Blog.findByIdAndDelete(BlogPostId);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found." });
    }
    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
