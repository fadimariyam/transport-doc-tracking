const db = require("../config/db");


/* CREATE REQUEST */
const createRequest = async (
  qr_text,
  name,
  email,
  phone
) => {

  const res = await db.query(

    `
    INSERT INTO access_requests
    (qr_text,name,email,phone,status)

    VALUES($1,$2,$3,$4,'pending')

    RETURNING *
    `,

    [qr_text,name,email,phone]

  );

  return res.rows[0];

};


const checkApproved = async (qr_text) => {

  const res = await db.query(

    `
    SELECT *
    FROM access_requests

    WHERE qr_text=$1
    AND status='approved'

    ORDER BY id DESC
    LIMIT 1
    `,

    [qr_text]

  );

  return res.rows[0];

};


/* DENY REQUEST */
const denyRequest = async (id) => {

  const res = await db.query(

    `
    UPDATE access_requests
    SET status='denied'
    WHERE id=$1
    RETURNING *
    `,

    [id]

  );

  return res.rows[0];

};

/* LIST REQUESTS (admin) */

const getRequests = async () => {

  const res = await db.query(

    `
    SELECT *
    FROM access_requests
    ORDER BY id DESC
    `

  );

  return res.rows;

};


/* APPROVE */

const approveRequest = async (id) => {

  const res = await db.query(

    `
    UPDATE access_requests
    SET status='approved'
    WHERE id=$1
    RETURNING *
    `,

    [id]

  );

  return res.rows[0];

};


module.exports = {

  createRequest,
  checkApproved,
  getRequests,
  approveRequest,
  denyRequest

};