const {
  createVehicle,
  getVehicles,
  countVehicles,
  getVehicleById
} = require("../models/vehicleModel");

const {
  deleteVehicle
} = require("../models/vehicleModel");

const {
  generateVehicleId,
} = require("../utils/idGenerator");

const calcStatus = require(
  "../utils/statusCalc"
);

const addVehicle = async (req, res) => {
  try {
    const {
 name,
 type,
 brand,
 plate,
 owner,
 category,
 current_km,
 last_oil,
 interval
} = req.body;

    if (!name)
      return res.status(400).json("Name required");

    if (!type)
      return res.status(400).json("Type required");

    const vehicle_id =
      await generateVehicleId(type);

    const next_oil =
      Number(last_oil) +
      Number(interval);

    const status = calcStatus(
      current_km,
      last_oil,
      interval
    );

    const vehicle =
      await createVehicle({
        vehicle_id,
        name,
        type,
        brand,
        plate,
        owner,
        category,
        current_km,
        last_oil,
        next_oil,
        status,
      });

    res.json(vehicle);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

const listVehicles = async (
  req,
  res
) => {
  try {
    const page =
      parseInt(req.query.page) || 1;

    const limit =
      parseInt(req.query.limit) || 5;

    const search =
      req.query.search || "";

    const rows =
      await getVehicles(
        page,
        limit,
        search
      );

    const total =
      await countVehicles(search);

    res.json({
      rows,
      total,
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
};

const getOneVehicle = async (req, res) => {

  try {

    const { id } = req.params;

    const vehicle =
      await getVehicleById(id);

    res.json(vehicle);

  } catch (err) {

    res.status(500).json(err.message);

  }

};
const { updateVehicle } =
require("../models/vehicleModel");


const editVehicle = async (req, res) => {

  try {

    const { id } = req.params;

    const data =
      await updateVehicle(
        id,
        req.body
      );

    res.json(data);

  } catch (err) {

    res.status(500).json(err.message);

  }

};

const removeVehicle = async (req, res) => {

  try {

    await deleteVehicle(
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
  addVehicle,
  listVehicles,
  getOneVehicle,
  editVehicle,
  removeVehicle
};