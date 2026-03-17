const cron = require("node-cron");

const db = require("../config/db");

const sendMail =
require("../config/mail");


cron.schedule(
  "0 8 * * *",
  async () => {

    console.log(
      "Checking expiry..."
    );


/* ================= DOCS ================= */

    const docs =
      await db.query(

        `
        SELECT *
        FROM documents
        `

      );


    for (let d of docs.rows) {

      if (!d.expiry)
        continue;

      const today =
        new Date();

      const exp =
        new Date(d.expiry);

      const diff =
        (exp - today) /
        (1000*60*60*24);


      if (diff < 0) {

        await sendMail(

          "Document expired",

          d.name +
          " expired"

        );

      }

      else if (diff < 30) {

        await sendMail(

          "Document expiring",

          d.name +
          " expiring soon"

        );

      }

    }


/* ================= OIL ================= */

    const vehicles =
      await db.query(

        `
        SELECT *
        FROM vehicles
        `

      );


    for (let v of vehicles.rows) {

      const next =
        v.next_oil;

      const current =
        v.current_km;


      if (current > next) {

        await sendMail(

          "Oil expired",

          v.name +
          " oil expired"

        );

      }

      else if (
        current >
        next - 500
      ) {

        await sendMail(

          "Oil soon",

          v.name +
          " oil soon"

        );

      }

    }

  }

);