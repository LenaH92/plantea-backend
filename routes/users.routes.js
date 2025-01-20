const mongoose = require("mongoose");
const router = require("express").Router();
const User = require("../models/User.model.js");

router.get("/", async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get("/:userId", async (req, res, next) => {
    const { userId } = req.params;

    if (mongoose.Types.ObjectId.isValid(userId)) {
        try {
            const user = await User.findById(userId);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json();
            }
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({ message: "Invalid user ID" });
    }
});


router.post("/", async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});


router.put("/:userId", async (req, res, next) => {
    const { userId } = req.params;

    if (mongoose.Types.ObjectId.isValid(userId)) {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
                new: true,
                runValidators: true,
            });
            if (updatedUser) {
                res.json(updatedUser);
            } else {
                res.status(404).json();
            }
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({ message: "Invalid user ID" });
    }
});


router.delete("/:userId", async (req, res, next) => {
    const { userId } = req.params;

    if (mongoose.Types.ObjectId.isValid(userId)) {
        try {
            const deletedUser = await User.findByIdAndDelete(userId);
            if (deletedUser) {
                res.status(204).json();
            } else {
                res.status(404).json();
            }
        } catch (error) {
            next(error);
        }
    } else {
        res.status(400).json({ message: "Invalid user ID" });
    }
});

module.exports = router;
