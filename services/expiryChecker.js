// const cron = require("node-cron");

// const db = require("../config/db");

// const {
//   sendMail,
// } = require("./emailService");


// cron.schedule("0 9 * * *", async () => {

//   try {

//     console.log("Checking expiry...");

//     let messages = [];



// /* ================= DOCUMENTS ================= */

//     const docs = await db.query(`
//       SELECT d.*, v.name as vehicle_name
//       FROM documents d
//       LEFT JOIN vehicles v
//       ON d.item_id = v.id
//       WHERE d.item_type='vehicle'
//     `);


//     for (let d of docs.rows) {

//       if (!d.expiry) continue;

//       const today = new Date();
//       const exp = new Date(d.expiry);

//       const diff = Math.floor(
//         (exp - today) /
//         (1000 * 60 * 60 * 24)
//       );


//       if (diff < 0) {

//         messages.push(
//           `Vehicle: ${d.vehicle_name}<br>
// Document: ${d.name}<br>
// Status: EXPIRED`
//         );

//       }

//       else if (diff <= 30) {

//         messages.push(
//           `Vehicle: ${d.vehicle_name}<br>
// Document: ${d.name}<br>
// Status: SOON`
//         );

//       }

//     }



// /* ================= OIL ================= */

//     const vehicles = await db.query(`
//       SELECT *
//       FROM vehicles
//     `);


//     for (let v of vehicles.rows) {

//       if (!v.next_oil) continue;

//       if (v.current_km > v.next_oil) {

//         messages.push(
//           `Vehicle: ${v.name}<br>
// Oil: EXPIRED`
//         );

//       }

//       else if (
//         v.current_km >= v.next_oil - 500
//       ) {

//         messages.push(
//           `Vehicle: ${v.name}<br>
// Oil: SOON`
//         );

//       }

//     }



// /* ================= EQUIPMENT ================= */

//     const eq = await db.query(`
//       SELECT *
//       FROM equipments
//     `);


//     for (let e of eq.rows) {

//       if (!e.warranty) continue;

//       const today = new Date();
//       const exp = new Date(e.warranty);

//       const diff = Math.floor(
//         (exp - today) /
//         (1000 * 60 * 60 * 24)
//       );


//       if (diff < 0) {

//         messages.push(
//           `Equipment: ${e.name}<br>
// Warranty: EXPIRED`
//         );

//       }

//       else if (diff <= 30) {

//         messages.push(
//           `Equipment: ${e.name}<br>
// Warranty: SOON`
//         );

//       }

//     }



// /* ================= SEND MAIL ================= */

//     if (messages.length > 0) {

//       const text =
//         "<h3>Transport DTS Alerts</h3><br>" +
//         messages.join("<br><br>");


//       await sendMail(

//         process.env.ADMIN_MAIL,

//         "Expiry Alerts",

//         text

//       );

//       console.log("Mail sent");

//     } else {

//       console.log("No expiry alerts");

//     }


//   } catch (err) {

//     console.log("Expiry checker error:", err);

//   }

// });


const cron = require("node-cron");

const db = require("../config/db");

const { sendMail } =
  require("./emailService");


cron.schedule("0 9 * * *", async () => {

  try {

    console.log("Checking expiry...");

    let rows = [];


/* ================= DOCUMENTS ================= */

const docs = await db.query(`
SELECT d.*, v.name as vehicle_name
FROM documents d
LEFT JOIN vehicles v
ON d.item_id = v.id
WHERE d.item_type='vehicle'
AND alert_sent=false
`);

for (let d of docs.rows) {

  if (!d.expiry) continue;

  const diff = Math.floor(
    (new Date(d.expiry) - new Date()) /
    (1000*60*60*24)
  );

  if (diff < 0 || diff <= 30) {

    rows.push(`
<tr>
<td>${d.vehicle_name}</td>
<td>${d.name}</td>
<td>${diff < 0 ? "EXPIRED" : "SOON"}</td>
<td>${d.expiry.toISOString().slice(0,10)}</td>
</tr>
`);

    await db.query(
      "UPDATE documents SET alert_sent=true WHERE id=$1",
      [d.id]
    );

  }

}


/* ================= EQUIPMENT ================= */

const eq = await db.query(`
SELECT *
FROM equipments
WHERE alert_sent=false
`);

for (let e of eq.rows) {

  if (!e.warranty) continue;

  const diff = Math.floor(
    (new Date(e.warranty) - new Date()) /
    (1000*60*60*24)
  );

  if (diff < 0 || diff <= 30) {

    rows.push(`
<tr>
<td>${e.name}</td>
<td>Warranty</td>
<td>${diff < 0 ? "EXPIRED" : "SOON"}</td>
<td>${e.warranty.toISOString().slice(0,10)}</td>
</tr>
`);

    await db.query(
      "UPDATE equipments SET alert_sent=true WHERE id=$1",
      [e.id]
    );

  }

}


/* ================= OIL ================= */

const vehicles = await db.query(`
SELECT *
FROM vehicles
WHERE oil_alert_sent=false
`);

for (let v of vehicles.rows) {

  if (!v.next_oil) continue;

  if (v.current_km > v.next_oil ||
      v.current_km >= v.next_oil - 500) {

    rows.push(`
<tr>
<td>${v.name}</td>
<td>Oil</td>
<td>${v.current_km > v.next_oil ? "EXPIRED" : "SOON"}</td>
<td>KM ${v.next_oil}</td>
</tr>
`);

    await db.query(
      "UPDATE vehicles SET oil_alert_sent=true WHERE id=$1",
      [v.id]
    );

  }

}


/* ================= SEND ================= */

if (rows.length > 0) {

const html = `

<h2>Transport DTS Alerts</h2>

<table border="1" cellpadding="5" cellspacing="0">

<tr>
<th>Name</th>
<th>Item</th>
<th>Status</th>
<th>Expiry</th>
</tr>

${rows.join("")}

</table>

`;

await sendMail(
  process.env.ADMIN_MAIL,
  "Expiry Alerts",
  html
);

console.log("Mail sent");

}

else {

console.log("No alerts");

}

  } catch (err) {

    console.log(err);

  }

});