const db = require("../config/db");

const getPrefix = (name) => {
  if (!name || name.length < 2) return "XX";
  return name.substring(0, 2).toUpperCase();
};

const generateVehicleId = async (type) => {
  if (!type) throw new Error("Type required");

  const prefix = getPrefix(type);

  const result = await db.query(
    "SELECT COUNT(*) FROM vehicles WHERE type=$1",
    [type]
  );

  const count = Number(result.rows[0].count) + 1;

  return prefix + String(count).padStart(3, "0");
};

const generateEquipmentId = async (type) => {
  if (!type) throw new Error("Type required");

  const prefix = getPrefix(type);

  const result = await db.query(
    "SELECT COUNT(*) FROM equipments WHERE type=$1",
    [type]
  );

  const count = Number(result.rows[0].count) + 1;

  return prefix + String(count).padStart(4, "0");
};

module.exports = {
  generateVehicleId,
  generateEquipmentId,
};