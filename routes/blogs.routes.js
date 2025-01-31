const { isValidObjectId } = require("mongoose");
const Blog = require("../models/Blog.model");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");

const router = require("express").Router();
// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");

router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find().populate("userId", "username profilePicture"); //check if populate without passing hash
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/* Get route to ONE blog */
router.get("/:blogId", async (req, res, next) => {
  const { blogId } = req.params;
  if (isValidObjectId(blogId)) {
    try {
      const blog = await Blog.findById(blogId)
        .populate("userId", "username profilePicture")
        .populate({
          path: "comments",
          populate: { path: "userId", select: "username profilePicture" },
        }); //populating the comments so we can display them
      if (blog) {
        res.status(200).json(blog);
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

/* PUT route to edit one blog */
router.put("/:blogId", isAuthenticated, async (req, res, next) => {
  const { blogId } = req.params;
  const { title, textContent } = req.body;
  if (isValidObjectId(blogId)) {
    try {
      const blogToUpdate = await Blog.findById(blogId);
      if (blogToUpdate) {
        if (blogToUpdate.userId.toString() === req.tokenPayload.userId) {
          const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            { title, textContent },
            { new: true }
          );
          res.status(200).json(updatedBlog);
        }
      }
    } catch (error) {
      next(error);
    }
  }
});

// POST "/api/blogs/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/new/upload", isAuthenticated, fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)

  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }

  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend

  res.json({ fileUrl: req.file.path });
});


router.post("/new", isAuthenticated, async (req, res, next) => {
  const { title, textContent, tags, categories, selectedSpecies, mediaContent } = req.body;
  const userId = req.tokenPayload.userId;
  try {
    const newBlog = await Blog.create({
      title,
      textContent,
      tags,
      categories,
      userId,
      selectedSpecies,
      mediaContent
    });
    const savedBlog = await newBlog.save();
    console.log("Blog saved to database:", savedBlog);

    res.status(201).json(savedBlog);
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
