const router = require("express").Router();

const auth = require("../middleware/auth");

const {
  registerVehicle,
  registerEquipment,
} = require("../controllers/registerController");

router.post(
  "/vehicle",
  auth,
  registerVehicle
);

router.post(
  "/equipment",
  auth,
  registerEquipment
);

module.exports = router;