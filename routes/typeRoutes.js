const router = require("express").Router();

const {
  getAllTypes,
  createType,
} = require("../controllers/typeController");

const auth = require("../middleware/auth");

router.get("/", auth, getAllTypes);

router.post("/", auth, createType);

module.exports = router;