const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {

    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json("No token");
    }

    // Bearer TOKEN
    const parts = header.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json("Invalid token format");
    }

    const token = parts[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (err) {

    console.log(err);

    return res.status(401).json("Invalid token");

  }
};

module.exports = auth;