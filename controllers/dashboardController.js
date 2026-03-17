const db = require("../config/db");

const getDashboard = async (req, res) => {

  try {

    /* ================= TOTAL ================= */

    const totalVehicles =
      await db.query(
        `SELECT COUNT(*) FROM vehicles`
      );

    const totalEquipments =
      await db.query(
        `SELECT COUNT(*) FROM equipments`
      );


    /* ================= SOON VEHICLES ================= */

    const soonVehicles =
      await db.query(
        `
        SELECT COUNT(*)
        FROM vehicles
        WHERE status='Soon'
           OR status='Expired'
        `
      );


    /* ================= SOON EQUIPMENTS (recalc) ================= */

    const eqRows =
      await db.query(
        `SELECT warranty FROM equipments`
      );

    let soonEq = 0;

    eqRows.rows.forEach(e => {

      if (!e.warranty) return;

      const diff =
        (new Date(e.warranty) - Date.now()) /
        (1000 * 60 * 60 * 24);

      if (diff < 30)
        soonEq++;

    });


    /* ================= RECENT ================= */

    const recent =
      await db.query(
        `
        SELECT id,name,status,'Vehicle' as category
        FROM vehicles

        UNION ALL

        SELECT id,name,status,'Equipment' as category
        FROM equipments

        ORDER BY id DESC
        LIMIT 10
        `
      );


    res.json({

      totalVehicles:
        Number(totalVehicles.rows[0].count),

      totalEquipments:
        Number(totalEquipments.rows[0].count),

      soonVehicles:
        Number(soonVehicles.rows[0].count),

      soonEquipments:
        soonEq,

      recent:
        recent.rows,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json(err.message);

  }

};

module.exports = {
  getDashboard,
};