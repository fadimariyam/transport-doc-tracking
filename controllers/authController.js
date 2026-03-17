const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


/* ================= LOGIN ================= */

const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    console.log(
      "LOGIN BODY:",
      email,
      password
    );


    /* FIND USER */

    const result = await db.query(

      "SELECT * FROM users WHERE email=$1",

      [email]

    );


    console.log(
      "DB RESULT:",
      result.rows
    );


    if (result.rows.length === 0) {

      return res
        .status(401)
        .json("User not found");

    }


    const user = result.rows[0];


    /* CHECK PASSWORD (bcrypt) */

    const match =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!match) {

      return res
        .status(401)
        .json("Wrong password");

    }


    /* CREATE TOKEN */

    const token = jwt.sign(

      {
        id: user.id,
        email: user.email,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );


    /* RESPONSE */

    res.json({
      token,
    });


  } catch (err) {

    console.log(err);

    res
      .status(500)
      .json(err.message);

  }

};


module.exports = {
  login,
};