const db = require("../config/db");

/* ================= CREATE ================= */

const createVehicle = async (data) => {
  const res = await db.query(
    `
    INSERT INTO vehicles
    (vehicle_id,name,type,current_km,last_oil,next_oil,status,brand,plate,owner,category)
VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
    `,
[
data.vehicle_id,
data.name,
data.type,
data.current_km,
data.last_oil,
data.next_oil,
data.status,
data.brand,
data.plate,
data.owner,
data.category,

// ✅ THIS IS IMPORTANT
      `vehicle-${data.vehicle_id}`
      
]
  );

  return res.rows[0];
};

/* ================= LIST ================= */

const getVehicles = async (
  page,
  limit,
  search
) => {

  const offset = (page - 1) * limit;

  const res = await db.query(
    `
    SELECT *
    FROM vehicles
    WHERE name ILIKE $1 OR
    brand ILIKE $1 OR
      plate ILIKE $1 OR
      type ILIKE $1 OR
      owner ILIKE $1 OR
      vehicle_id ILIKE $1
    ORDER BY id DESC
    LIMIT $2 OFFSET $3
    `,
    [`%${search}%`, limit, offset]
  );

  return res.rows;
};

const countVehicles = async (search) => {

  const res = await db.query(
    `
    SELECT COUNT(*)
    FROM vehicles
    WHERE name ILIKE $1 OR
brand ILIKE $1 OR
plate ILIKE $1 OR
type ILIKE $1 OR
owner ILIKE $1 OR
vehicle_id ILIKE $1
    `,
    [`%${search}%`]
  );

  return Number(res.rows[0].count);
};


/* ================= GET ONE ================= */

const getVehicleById = async (id) => {

  const res = await db.query(
    `
    SELECT *
    FROM vehicles
    WHERE id=$1
    `,
    [id]
  );

  return res.rows[0];
};


/* ================= UPDATE ================= */
const updateVehicle = async (id, data) => {

  const res = await db.query(
    `
    UPDATE vehicles
    SET
      name=$1,
      type=$2,
      brand=$3,
      plate=$4,
      owner=$5,
      category=$6,
      current_km=$7,
      last_oil=$8,
      next_oil=$9,
      status=$10
    WHERE id=$11
    RETURNING *
    `,
    [
      data.name,
      data.type,
      data.brand,
      data.plate,
      data.owner,
      data.category,
      data.current_km,
      data.last_oil,
      data.next_oil,
      data.status,
      id,
    ]
  );

  return res.rows[0];
};

/* ================= QR ================= */

const setVehicleQR = async (id, qr) => {

  const res = await db.query(
    `
    UPDATE vehicles
    SET qr=$1
    WHERE id=$2
    RETURNING *
    `,
    [qr, id]
  );

  return res.rows[0];
};


/*=============DELETE========= */
const deleteVehicle = async (id) => {

  await db.query(
    `
    DELETE FROM vehicles
    WHERE id=$1
    `,
    [id]
  );

};

module.exports = {
  createVehicle,
  getVehicles,
  countVehicles,
  getVehicleById,
  updateVehicle,
  setVehicleQR,
  deleteVehicle
};