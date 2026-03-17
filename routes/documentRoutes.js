console.log("documentRoutes loaded");

const router = require("express").Router();

const auth = require("../middleware/auth");

const upload = require(
  "../middleware/upload"
);

const {
  uploadDoc,
  listDocs,
  removeDoc,
} = require("../controllers/documentController");

router.post(
  "/upload",
  auth,
  upload.single("file"),
  uploadDoc
);

router.get("/", auth, listDocs);

router.delete("/:id",auth,  removeDoc);

module.exports = router;