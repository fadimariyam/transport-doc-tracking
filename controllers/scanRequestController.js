const db = require("../config/db");

const {
  createRequest,
  checkApproved,
  getRequests,
  approveRequest,
  denyRequest
} = require("../models/scanRequestModel");

const {sendMail} = require("../services/emailService");


/* ================= CREATE REQUEST ================= */

const sendRequest = async (req, res) => {

  try {

    const {
      qr_text,
      name,
      email,
      phone,
    } = req.body;


    const data = await createRequest(
      qr_text,
      name,
      email,
      phone
    );


    /* detect id */

    const id =
      qr_text.replace(/[^0-9]/g,"");


    /* get vehicle name */

    let itemName = "";

    if (qr_text.includes("vehicle")) {

      const v = await db.query(
        "SELECT name FROM vehicles WHERE id=$1",
        [id]
      );

      itemName =
        v.rows[0]?.name || "";

    }


    if (qr_text.includes("equipment")) {

      const e = await db.query(
        "SELECT name FROM equipments WHERE id=$1",
        [id]
      );

      itemName =
        e.rows[0]?.name || "";

    }


    const approveLink =
    //   `http://localhost:5000/api/scan/approve/${data.id}`;
    `${process.env.BACKEND_URL}/api/scan/approve/${data.id}`;


    const denyLink =
    //   `http://localhost:5000/api/scan/deny/${data.id}`;
    `${process.env.BACKEND_URL}/api/scan/deny/${data.id}`;


    const html = `

    <h2>Document Access Request</h2>

    <p><b>User:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Phone:</b> ${phone}</p>

    <hr/>

    <p><b>Item:</b> ${itemName}</p>
    <p><b>QR:</b> ${qr_text}</p>

    <br/>

    <a href="${approveLink}"
      style="
        background:green;
        color:white;
        padding:10px 15px;
        text-decoration:none;
        margin-right:10px;
      "
    >
      APPROVE
    </a>

    <a href="${denyLink}"
      style="
        background:red;
        color:white;
        padding:10px 15px;
        text-decoration:none;
      "
    >
      DENY
    </a>

    `;


    await sendMail(
      process.env.ADMIN_MAIL,
      "Access Request",
      html
    );


    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json(err.message);

  }

};

/* ================= CHECK ACCESS ================= */

const checkAccess = async (req, res) => {

  try {

    const { text } = req.params;

    const approved = await db.query(
      `
      SELECT *
      FROM access_requests
      WHERE qr_text=$1
      AND status='approved'
      ORDER BY id DESC
      LIMIT 1
      `,
      [text]
    );

    if (approved.rows.length > 0) {
      return res.json({ allowed: true });
    }


    const denied = await db.query(
      `
      SELECT *
      FROM access_requests
      WHERE qr_text=$1
      AND status='denied'
      ORDER BY id DESC
      LIMIT 1
      `,
      [text]
    );

    if (denied.rows.length > 0) {
      return res.json({ denied: true });
    }


    res.json({ allowed: false });

  } catch (err) {

    console.log(err);

    res.status(500).json(err.message);

  }

};

/* ================= LIST REQUESTS ================= */

const listRequests = async (req, res) => {
  try {

    const data =
      await getRequests();

    res.json(data);

  } catch (err) {
    res.status(500).json(err.message);
  }
};


/* ================= APPROVE/ DENY ================= */

const approve = async (req, res) => {

  try {

    const { id } = req.params;

    await approveRequest(id);

    res.send(`
      <h2>Request Approved</h2>
      <p>You can close this page</p>
    `);

  } catch (err) {

    res.status(500).send("Error");

  }

};



const deny = async (req, res) => {

  try {

    const { id } = req.params;

    await denyRequest(id);

    res.send(`
      <h2>Request Denied</h2>
      <p>You can close this page</p>
    `);

  } catch (err) {

    res.status(500).send("Error");

  }

};

/* ================= PUBLIC DOCS ================= */

const getPublicDocs = async (req, res) => {

  try {

    const { text } = req.params;

    console.log("QR TEXT =", text);

    // extract id from vehicle-5 / equipment-3

    const id =
      text.replace(/[^0-9]/g, "");

    const type =
      text.includes("equipment")
        ? "equipment"
        : "vehicle";


    console.log("TYPE =", type);
    console.log("ID =", id);


    const docs = await db.query(
      `
      SELECT *
      FROM documents
      WHERE item_type=$1
      AND item_id=$2
      ORDER BY id DESC
      `,
      [type, id]
    );


    console.log("DOCS =", docs.rows);

    res.json(docs.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json(err.message);

  }

};


module.exports = {
  sendRequest,
  checkAccess,
  listRequests,
  approve,
  deny,
  getPublicDocs,
};