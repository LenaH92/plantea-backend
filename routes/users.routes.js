const { isValidObjectId } = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const Blog = require("../models/Blog.model");
const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}); //we need to get just one user for the profile page

router.get("/profile", isAuthenticated, async (req, res, next) => {
  const userId = req.tokenPayload.userId;
  if (isValidObjectId(userId)) {
    try {
      const user = await User.findById(userId).select("-passwordHash");
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ message: "Invalid user ID" });
  }
});

// routes/users.js
router.get("/myblogs", isAuthenticated, async (req, res, next) => {
  const userId = req.tokenPayload.userId;
  if (isValidObjectId(userId)) {
    try {
      const user = await User.findById(userId)
        .select("-passwordHash")
        .populate("blogs");
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "Blogs not found" });
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ message: "Invalid user or blogs" });
  }
});

// users.routes.js
router.get("/mycomments", isAuthenticated, async (req, res, next) => {
  const userId = req.tokenPayload.userId;

  if (isValidObjectId(userId)) {
    try {
      const user = await User.findById(userId)
        .select("-passwordHash")
        .populate({
          path: "comments",
          populate: {
            path: "blogPostId",
            select: "title textContent mediaContent",
          },
        });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "Blogs not found" });
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ message: "Invalid comment or blog" });
  }
});

router.put("/profile", isAuthenticated, async (req, res, next) => {
  const userId = req.tokenPayload.userId; // Get userId from token
  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body, // Ensure the frontend sends all required fields
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
