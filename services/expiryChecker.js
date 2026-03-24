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

//       const diff =
//         (exp - today) /
//         (1000 * 60 * 60 * 24);


//       if (diff < 0) {

//         messages.push(
//           `Vehicle: ${d.vehicle_name} <br>
// Document: ${d.name} <br>
// Status: EXPIRED`
//         );

//       }

//       else if (diff < 30) {

//         messages.push(
//           `Vehicle: ${d.vehicle_name} <br>
// Document: ${d.name} <br>
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
//           `Vehicle: ${v.name} <br>
// Oil: EXPIRED`
//         );

//       }

//       else if (
//         v.current_km >
//         v.next_oil - 500
//       ) {

//         messages.push(
//           `Vehicle: ${v.name} <br>
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

//       const diff =
//         (exp - today) /
//         (1000 * 60 * 60 * 24);


//       if (diff < 0) {

//         messages.push(
//           `Equipment: ${e.name} <br>
// Warranty: EXPIRED`
//         );

//       }

//       else if (diff < 30) {

//         messages.push(
//           `Equipment: ${e.name} <br>
// Warranty: SOON`
//         );

//       }

//     }



// /* ================= SEND ONE MAIL ================= */

//     if (messages.length > 0) {

//       const text =
//         "Transport DTS Alerts :<br><br>" +
//         messages.join("<br><br>");


//       await sendMail(

//         process.env.ADMIN_MAIL,

//         "Expiry Alerts",
//          text

//       );

//       console.log("Mail sent");

//     }


//   } catch (err) {

//     console.log(err);

//   }

// });

const cron = require("node-cron");

const db = require("../config/db");

const {
  sendMail,
} = require("./emailService");


cron.schedule("* * * * *", async () => {

  try {

    console.log("Checking expiry...");

    let messages = [];



/* ================= DOCUMENTS ================= */

    const docs = await db.query(`
      SELECT d.*, v.name as vehicle_name
      FROM documents d
      LEFT JOIN vehicles v
      ON d.item_id = v.id
      WHERE d.item_type='vehicle'
    `);


    for (let d of docs.rows) {

      if (!d.expiry) continue;

      const today = new Date();
      const exp = new Date(d.expiry);

      const diff = Math.floor(
        (exp - today) /
        (1000 * 60 * 60 * 24)
      );


      if (diff < 0) {

        messages.push(
          `Vehicle: ${d.vehicle_name}<br>
Document: ${d.name}<br>
Status: EXPIRED`
        );

      }

      else if (diff <= 30) {

        messages.push(
          `Vehicle: ${d.vehicle_name}<br>
Document: ${d.name}<br>
Status: SOON`
        );

      }

    }



/* ================= OIL ================= */

    const vehicles = await db.query(`
      SELECT *
      FROM vehicles
    `);


    for (let v of vehicles.rows) {

      if (!v.next_oil) continue;

      if (v.current_km > v.next_oil) {

        messages.push(
          `Vehicle: ${v.name}<br>
Oil: EXPIRED`
        );

      }

      else if (
        v.current_km >= v.next_oil - 500
      ) {

        messages.push(
          `Vehicle: ${v.name}<br>
Oil: SOON`
        );

      }

    }



/* ================= EQUIPMENT ================= */

    const eq = await db.query(`
      SELECT *
      FROM equipments
    `);


    for (let e of eq.rows) {

      if (!e.warranty) continue;

      const today = new Date();
      const exp = new Date(e.warranty);

      const diff = Math.floor(
        (exp - today) /
        (1000 * 60 * 60 * 24)
      );


      if (diff < 0) {

        messages.push(
          `Equipment: ${e.name}<br>
Warranty: EXPIRED`
        );

      }

      else if (diff <= 30) {

        messages.push(
          `Equipment: ${e.name}<br>
Warranty: SOON`
        );

      }

    }



/* ================= SEND MAIL ================= */

    if (messages.length > 0) {

      const text =
        "<h3>Transport DTS Alerts</h3><br>" +
        messages.join("<br><br>");


      await sendMail(

        process.env.ADMIN_MAIL,

        "Expiry Alerts",

        text

      );

      console.log("Mail sent");

    } else {

      console.log("No expiry alerts");

    }


  } catch (err) {

    console.log("Expiry checker error:", err);

  }

});