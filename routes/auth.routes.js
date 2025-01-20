const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middlewares//route-guard.middleware");

const router = express.Router();

// POST Signup
router.post("/signup", async (req, res, next) => {
  const { firstName, surname, email, username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const salt = bcrypt.genSaltSync(13);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = await User.create({
      firstName,
      surname,
      email,
      username,
      passwordHash,
    });

    const { passwordHash: _, ...userData } = newUser.toObject();
    res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
});

// POST Login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json();
    }

    const passwordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(403).json({ message: "Invalid credentials." });
    }

    const payload = { userId: user._id };
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.json({ token: authToken });
  } catch (error) {
    next(error);
  }
});

// GET Verify
router.get("/verify", isAuthenticated, async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.tokenPayload.userId).select(
      "-passwordHash"
    );
    if (!currentUser) {
      return res.status(404).json();
    }
    res.json(currentUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
