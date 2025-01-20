const mongoose = require("mongoose");
const router = require("express").Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

// Get all users (Admin only, excluding passwordHash)
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Get a single user by ID (Authenticated users only)
router.get("/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;

  if (mongoose.isValidObjectId(userId)) {
    try {
      const user = await User.findById(userId).select("-passwordHash");
      if (user) {
        // Ensure the user can only access their own profile unless they are an admin
        if (req.user.role === "admin" || req.user._id.toString() === userId) {
          res.json(user);
        } else {
          res.status(403).json({ message: "Access forbidden" });
        }
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

// Create a new user (Admin only)
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Update a user by ID (Authenticated users only)
router.put("/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;

  if (mongoose.isValidObjectId(userId)) {
    try {
      // Ensure the user can only update their own profile unless they are an admin
      if (req.user.role === "admin" || req.user._id.toString() === userId) {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
          new: true,
          runValidators: true,
        });
        if (updatedUser) {
          res.json(updatedUser);
        } else {
          res.status(404).json({ message: "User not found" });
        }
      } else {
        res.status(403).json({ message: "Access forbidden" });
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(400).json({ message: "Invalid user ID" });
  }
});

// Delete a user by ID (Admin only)
router.delete("/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;

  if (mongoose.isValidObjectId(userId)) {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (deletedUser) {
        res.status(204).send();
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

module.exports = router;
