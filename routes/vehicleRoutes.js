const router = require("express").Router();

const auth = require("../middleware/auth");

const {
  addVehicle,
  listVehicles,
  getOneVehicle,
  editVehicle,
  removeVehicle
} = require("../controllers/vehicleController");

router.post("/", auth, addVehicle);

router.get("/", auth, listVehicles);

router.get("/:id", auth, getOneVehicle);

router.put("/:id", auth, editVehicle);

router.delete("/:id", auth, removeVehicle);

module.exports = router;