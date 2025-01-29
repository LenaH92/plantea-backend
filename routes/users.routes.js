const { isValidObjectId } = require("mongoose");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");
const Blog = require("../models/Blog.model");
const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");

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
        .populate({
          path: "blogs",
          // a nested populate so that each Blog's userId is also populated
          populate: {
            path: "userId",
            select: "username profilePicture", // choose only the necessary fields
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
          // We can pass an array to "populate" if we want to populate multiple references
          populate: [
            {
              // Populate the Blog document attached to the comment
              path: "blogPostId",
              select: "title textContent mediaContent userId",
              populate: {
                // Then populate the blog’s author
                path: "userId",
                select: "username profilePicture",
              },
            },
            {
              // Also populate the user who made the comment
              path: "userId",
              select: "username profilePicture",
            },
          ],
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

// / POST "/api/users/uploadProfileImage" => Uploads profile image to Cloudinary
router.post(
  "/profilePicture",
  isAuthenticated,
  fileUploader.single("imageUrl"), // Ensure frontend sends 'imageUrl'
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded!" });
      }

      const userId = req.tokenPayload.userId;
      const imageUrl = req.file.path; // Cloudinary URL

      // Update user profile with new image URL
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePicture: imageUrl },
        { new: true, runValidators: true }
      ).select("-passwordHash");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        profileImageUrl: imageUrl,
        message: "Profile picture updated!",
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
