const {
  createEquipment,
  getEquipments,
  countEquipments,
  getEquipmentById,
  updateEquipment
} = require("../models/equipmentModel");

const {
  deleteEquipment
} = require("../models/equipmentModel");

const {
  generateEquipmentId,
} = require("../utils/idGenerator");


/* ================= STATUS ================= */

const calcStatus = (warranty) => {

  if (!warranty) return "Normal";

  const d = new Date(warranty);

  const diff =
    (d - Date.now()) /
    (1000 * 60 * 60 * 24);

  if (diff < 0) return "Expired";
  if (diff < 30) return "Soon";

  return "Normal";

};


/* ================= ADD ================= */

const addEquipment = async (req, res) => {

  try {

    const {
      name,
      type,
      serial,
      handled_by,
      warranty
    } = req.body;


    if (!name)
      return res
        .status(400)
        .json("Name required");

    if (!type)
      return res
        .status(400)
        .json("Type required");


    const equipment_id =
      await generateEquipmentId(type);


    const status =
      calcStatus(warranty);


    const equipment =
      await createEquipment({

        equipment_id,
        name,
        type,
        serial,
        handled_by,
        warranty,
        status

      });


    res.json(equipment);

  } catch (err) {

    console.log(err);

    res
      .status(500)
      .json(err.message);

  }

};


/* ================= LIST ================= */

const listEquipments =
  async (req, res) => {

    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 5;

    const search =
      req.query.search || "";

    const rows =
      await getEquipments(
        page,
        limit,
        search
      );

    /* ===== recalc status ===== */

    rows.forEach(e => {

      if (!e.warranty) return;

      const diff =
        (new Date(e.warranty) - Date.now()) /
        (1000 * 60 * 60 * 24);

      if (diff < 0)
        e.status = "Expired";
      else if (diff < 30)
        e.status = "Soon";
      else
        e.status = "Normal";

    });

    const total =
      await countEquipments(search);

    res.json({
      rows,
      total,
    });

};

/* ================= GET ONE ================= */

const getOneEquipment = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;

    const equipment =
      await getEquipmentById(id);

    res.json(equipment);

  } catch (err) {

    res
      .status(500)
      .json(err.message);

  }

};


/* ================= EDIT ================= */

// const editEquipment = async (
//   req,
//   res
// ) => {

//   try {

//     const { id } =
//       req.params;

//     const data =
//       await updateEquipment(
//         id,
//         req.body
//       );

//     res.json(data);

//   } catch (err) {

//     res
//       .status(500)
//       .json(err.message);

//   }

// };


const editEquipment = async (req, res) => {

  try {

    console.log("EDIT BODY =", req.body);
    console.log("EDIT ID =", req.params.id);

    const { id } = req.params;

    const data =
      await updateEquipment(
        id,
        req.body
      );

    res.json(data);

  } catch (err) {

    console.log("EDIT ERROR =", err);

    res.status(500).json(err.message);

  }

};


const removeEquipment =
  async (req, res) => {

    try {

      await deleteEquipment(
        req.params.id
      );

      res.json("deleted");

    } catch (err) {

      res.status(500).json(
        err.message
      );

    }

};


module.exports = {

  addEquipment,
  listEquipments,
  getOneEquipment,
  editEquipment,
  removeEquipment

};