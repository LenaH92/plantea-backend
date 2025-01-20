const mongoose = require("mongoose");
const router = require("express").Router();
const Blog = require("./models/Blog.model.js");

const Blogs = require('../blog.json???'); //add the file

router.get("/", async (req, res) => {
    try {
        const Blogs = await Blog.find();
        res.json(Blogs);
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
        const Blog = await Blog.findById(BlogPostId);
        res.status(400).json(Blog);
    } catch (error) {
        next(error);
    }
});


router.post("/", async (req, res, next) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.status(201).json(newBlog);
    } catch (error) {
        next(error);
    }
});

router.put("/:BlogPostId", async (req, res, next) => {
    const { BlogPostId } = req.params;
    if (mongoose.isValidObjectId(BlogPostId)) {
        try {
            const updatedBlog = await Blog.findByIdAndUpdate(BlogPostId, req.body, {
                new: true,
                runValidators: true,
            });
            res.json(updatedBlog);
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({ message: "invalid id" });
    }
});

router.delete("/:BlogPostId", async (req, res, next) => {
    const { BlogPostId } = req.params;
    if (mongoose.isValidObjectId(BlogPostId)) {
        try {
            await Blog.findByIdAndDelete(BlogPostId);
            res.status(204).json();
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({ message: "invalid id" });
    }
});
module.exports = router;
