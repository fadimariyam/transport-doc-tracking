const db = require("../config/db");


const getTypes = async (category) => {

  const res = await db.query(
    `
    SELECT *
    FROM types
    WHERE category=$1
    ORDER BY name
    `,
    [category]
  );

  return res.rows;
};


const addType = async (name, category) => {

  const res = await db.query(
    `
    INSERT INTO types(name,category)
    VALUES($1,$2)
    RETURNING *
    `,
    [name, category]
  );

  return res.rows[0];
};


module.exports = {
  getTypes,
  addType,
};