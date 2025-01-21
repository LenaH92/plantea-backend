const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { isAuthenticated } = require("../middlewares/route-guard.middleware");


router.get('/', (req, res) => {
  res.json('All good in auth  :)')
})


// POST Signup
router.post("/signup", async (req, res, next) => {
  const credentials = req.body; // { username: '...', password: '...'}
  if (!credentials.username || !credentials.password) {
    res.status(400).json({ message: "Provide username and password" });
    return;
  }

  try {
    const existingUser = await User.findOne({ username: credentials.username });
    if (existingUser) {
      res.status(400).json({ message: "The username is already taken" });
      return;
    }
    const existingEmail = await User.findOne({ email: credentials.email });
    if (existingEmail) {
      res.status(400).json({ message: "The email is already taken" });
      return;
    }
    const salt = bcrypt.genSaltSync(13);
    const passwordHash = bcrypt.hashSync(credentials.password, salt);
    const newUser = await User.create({ ...credentials, passwordHash });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// POST Login
router.post("/login", async (req, res, next) => {
  const credentials = req.body; // { username: '...', password: '...'}

  // Check for user with given username
  try {
    const potentialUser = await User.findOne({
      username: credentials.username,
    });
    if (potentialUser) {
      // Check the password
      if (
        bcrypt.compareSync(credentials.password, potentialUser.passwordHash)
      ) {
        // The user has the right credentials
        const payload = { userId: potentialUser._id };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });
        res.json({ token: authToken });
      } else {
        res.status(403).json({ message: "Incorrect password" });
      }
    } else {
      res.status(400).json({ message: "No user with this username" });
    }
  } catch (error) {
    next(error);
  }
});
// GET Verify
router.get("/verify", isAuthenticated, async (req, res, next) => {
  console.log("Log from handler");
  try {
    const currentUser = await User.findById(req.tokenPayload.userId).select(
      "-passwordHash"
    );
    // create a copy of currentUser using currentUser._doc, then delete copy.passwordHash
    res.json(currentUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
