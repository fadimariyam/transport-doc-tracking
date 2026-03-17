const db = require("../config/db");


/* ================= CREATE ================= */

const createDocument = async (
  item_type,
  item_id,
  name,
  expiry,
  url
) => {

  const res = await db.query(
    `
    INSERT INTO documents
    (
      item_type,
      item_id,
      name,
      expiry,
      url
    )
    VALUES($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      item_type,
      item_id,
      name,
      expiry,
      url,
    ]
  );

  return res.rows[0];

};


/* ================= LIST ================= */

const getDocuments = async (
  item_type,
  item_id
) => {

  const res = await db.query(
    `
    SELECT *
    FROM documents
    WHERE item_type=$1
    AND item_id=$2
    ORDER BY id DESC
    `,
    [
      item_type,
      item_id,
    ]
  );

  return res.rows;

};


/* ================= DELETE ================= */

const deleteDocument = async (id) => {

  const res = await db.query(
    `
    DELETE FROM documents
    WHERE id=$1
    RETURNING *
    `,
    [id]
  );

  return res.rows[0];

};


module.exports = {

  createDocument,
  getDocuments,
  deleteDocument,

};