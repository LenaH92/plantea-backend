const router = require("express").Router();
// router.get('/', (req, res) => {
//   res.json('All good in here')
// })
const authRoutes = require("./auth.routes");
router.use("/auth", authRoutes);

const blogsRoutes = require("./blogs.routes");
router.use("/blogs", blogsRoutes);

const commentsRoutes = require("./comments.routes");
router.use("/comments", commentsRoutes);

const usersRoutes = require("./users.routes");
router.use("/users", usersRoutes);

module.exports = router;
