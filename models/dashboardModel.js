const db = require("../config/db");

const getCounts = async () => {
  const v = await db.query(
    "SELECT COUNT(*) FROM vehicles"
  );

  const e = await db.query(
    "SELECT COUNT(*) FROM equipments"
  );

  const soonV = await db.query(
    `
    SELECT COUNT(*)
    FROM vehicles
    WHERE status='Soon'
    OR status='Expired'
    `
  );

  const soonE = await db.query(
    `
    SELECT COUNT(*)
    FROM equipments
    WHERE warranty < NOW() + interval '30 days'
    `
  );

  return {
    totalVehicles: Number(
      v.rows[0].count
    ),
    totalEquipments: Number(
      e.rows[0].count
    ),
    soonVehicles: Number(
      soonV.rows[0].count
    ),
    soonEquipments: Number(
      soonE.rows[0].count
    ),
  };
};

const getRecent = async (limit = 5) => {

  const res = await db.query(
    `
    SELECT
      id,
      name,
      'Vehicle' AS category
    FROM vehicles

    UNION ALL

    SELECT
      id,
      name,
      'Equipment' AS category
    FROM equipments

    ORDER BY id DESC
    LIMIT $1
    `,
    [limit]
  );

  return res.rows;

};

module.exports = {
  getCounts,
  getRecent,
};