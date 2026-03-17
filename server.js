require("dotenv").config();
require("./services/expiryChecker");
require("./utils/cron");
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const typeRoutes = require("./routes/typeRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const equipmentRoutes =require("./routes/equipmentRoutes");
const documentRoutes = require("./routes/documentRoutes");
const registerRoutes = require("./routes/registerRoutes");
const scanRequestRoutes =require("./routes/scanRequestRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// app.use(cors());

// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://transport-doc-front.vercel.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE","OPTIONS",],
//     credentials: true,
//   })
// );

app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});





app.use(express.json());
const path = require("path");

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/* ===== ROUTES ===== */

app.use("/api/auth", authRoutes);
app.use("/api/types", typeRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/equipments",equipmentRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/register", registerRoutes);
app.use("/api/scan",scanRequestRoutes);
app.use("/api/dashboard", dashboardRoutes);


/* ===== TEST ROUTE ===== */

app.delete("/test/:id", (req, res) => {
  res.send(req.params.id);
});


/* ===== ROOT ===== */

app.get("/", (req, res) => {
  res.send("Transport DTS Backend Running");
});


/* ===== START ===== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});