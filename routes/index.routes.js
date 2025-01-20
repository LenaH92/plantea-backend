const router = require('express').Router()
const blogRoutes = require('./routes/blogs.routes.js')
const commentsRoutes = require('./routes/comments.routes.js')
const usersRoutes = require('./routes/users.routes.js')
// router.get('/', (req, res) => {
//   res.json('All good in here')
// })

const blogsRoutes = require("./blogs.routes");
router.use("/blogs", blogsRoutes);

const commentsRoutes = require("./comments.routes");
router.use("/comments", commentsRoutes);

const usersRoutes = require("./user.routes");
router.use("/users", usersRoutes);

module.exports = router;
