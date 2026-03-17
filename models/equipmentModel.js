const db = require("../config/db");


/* ================= CREATE ================= */

const createEquipment = async (data) => {

  const res = await db.query(
    `
    INSERT INTO equipments
    (
      equipment_id,
      name,
      type,
      serial,
      handled_by,
      warranty,
      status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      data.equipment_id,
      data.name,
      data.type,
      data.serial,
      data.handled_by,
      data.warranty,
      data.status,
    ]
  );

  return res.rows[0];

};


/* ================= LIST ================= */

const getEquipments = async (
  page,
  limit,
  search
) => {

  const offset = (page - 1) * limit;

  const res = await db.query(
    `
    SELECT *
    FROM equipments
    WHERE name ILIKE $1 OR
      type ILIKE $1 OR
      serial ILIKE $1 OR
      handled_by ILIKE $1 OR
      equipment_id ILIKE $1
    ORDER BY id DESC
    LIMIT $2 OFFSET $3
    `,
    [`%${search}%`, limit, offset]
  );

  return res.rows;

};


const countEquipments = async (search) => {

  const res = await db.query(
    `
    SELECT COUNT(*)
    FROM equipments
    WHERE name ILIKE $1 OR
      type ILIKE $1 OR
      serial ILIKE $1 OR
      handled_by ILIKE $1 OR
      equipment_id ILIKE $1
    `,
    [`%${search}%`]
  );

  return Number(res.rows[0].count);

};


/* ================= GET ONE ================= */

const getEquipmentById = async (id) => {

  const res = await db.query(
    `
    SELECT *
    FROM equipments
    WHERE id=$1
    `,
    [id]
  );

  return res.rows[0];

};


/* ================= UPDATE ================= */

const updateEquipment = async (
  id,
  data
) => {

  const res = await db.query(
    `
    UPDATE equipments
    SET
      name=$1,
      type=$2,
      serial=$3,
      handled_by=$4,
      warranty=$5,
      status=$6
    WHERE id=$7
    RETURNING *
    `,
    [
      data.name,
      data.type,
      data.serial,
      data.handled_by,
      data.warranty,
      data.status,
      id,
    ]
  );

  return res.rows[0];

};


/* ================= QR ================= */

const setEquipmentQR = async (id, qr) => {

  const res = await db.query(
    `
    UPDATE equipments
    SET qr=$1
    WHERE id=$2
    RETURNING *
    `,
    [qr, id]
  );

  return res.rows[0];

};


/*============DELETE========== */

const deleteEquipment = async (id) => {

  await db.query(
    `
    DELETE FROM equipments
    WHERE id=$1
    `,
    [id]
  );

};


module.exports = {

  createEquipment,
  getEquipments,
  countEquipments,
  getEquipmentById,
  updateEquipment,
  setEquipmentQR,
  deleteEquipment

};