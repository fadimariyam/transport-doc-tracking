const {
  setVehicleQR,
} = require("../models/vehicleModel");

const {
  setEquipmentQR,
} = require("../models/equipmentModel");

const {
  generateQR,
} = require("../services/qrService");



/* ================= VEHICLE ================= */

const registerVehicle = async (req, res) => {

  try {

    const { id } = req.body;
    
      const qrText =
  `${process.env.FRONTEND_URL}/scan/vehicle-${id}`;

    console.log("QR TEXT =", qrText);   // ✅ ADD THIS

    const qrImage =
      await generateQR(qrText);

    const data =
      await setVehicleQR(id, qrText);

    res.json({
      ...data,
      qrImage,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json(err.message);

  }

};


/* ================= EQUIPMENT ================= */

const registerEquipment =
  async (req, res) => {

    try {

      const { id } = req.body;

        const qrText =
  `${process.env.FRONTEND_URL}/scan/equipment-${id}`;

      const qrImage =
        await generateQR(
          qrText
        );

      const data =
        await setEquipmentQR(
          id,
          qrText
        );

      res.json({
        ...data,
        qrImage,
      });

    } catch (err) {

      res.status(500).json(
        err.message
      );

    }

  };



module.exports = {

  registerVehicle,
  registerEquipment,

};