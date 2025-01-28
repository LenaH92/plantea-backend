const router = require("express").Router();
router.get("/", (req, res) => {
  res.json("All good in here");
});

const blogsRoutes = require("./blogs.routes");
router.use("/blogs", blogsRoutes);

const commentsRoutes = require("./comments.routes");
router.use("/comments", commentsRoutes);

const usersRoutes = require("./users.routes");
router.use("/users", usersRoutes);

const { plantRoutes } = require("./plant.routes");
router.use("/plants", plantRoutes);

module.exports = router;
