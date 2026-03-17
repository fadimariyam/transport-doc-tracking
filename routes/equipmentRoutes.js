const router =
  require("express").Router();

const auth =
  require("../middleware/auth");

const {
  addEquipment,
  listEquipments,
  getOneEquipment,
  editEquipment,
  removeEquipment
} = require(
  "../controllers/equipmentController"
);


router.post("/", auth, addEquipment);

router.get("/", auth, listEquipments);

router.get("/:id", auth, getOneEquipment);

router.put("/:id", auth, editEquipment);

router.delete("/:id", auth, removeEquipment);

module.exports = router;