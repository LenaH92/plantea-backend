const { isValidObjectId } = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

const router = require("express").Router();

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
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

module.exports = router;
