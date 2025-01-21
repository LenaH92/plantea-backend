const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  console.log("Log from middleware");
  try {
    if (req.headers.authorization?.split(" ")[0] === "Bearer") {
      const token = req.headers.authorization.split(" ")[1]; // get the token from headers "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Njk4Y2Q3ZDFjNDc3YjMwNzE2OGM0YTMiLCJpYXQiOjE3MjEyOTMxNjB9.0u-Xwq483aEjrj9D2RUsDUZuqMTsOWFKeP_KZRW93Uw"
      const payload = jwt.verify(token, process.env.TOKEN_SECRET); // decode token and get payload
      console.log(payload);
      req.tokenPayload = payload; // to pass the decoded payload to the next route
      console.log("Token found");
      next();
    } else {
      throw new Error("Token not provided");
    }
  } catch (error) {
    // the middleware will catch error and send 401 if:
    // 1. There is no token
    // 2. Token is invalid
    // 3. There is no headers or authorization in req (no token)
    res.status(401).json("token not provided or not valid");
  }
};

module.exports = { isAuthenticated };
