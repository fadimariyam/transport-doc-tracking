const router =
  require("express").Router();

const auth =
  require("../middleware/auth");

const {

  sendRequest,
  checkAccess,
  listRequests,
  approve,
  getPublicDocs,
  deny

} = require(
  "../controllers/scanRequestController"
);


/* PUBLIC */

router.post(
  "/request",
  sendRequest
);

router.get(
  "/check/:text",
  checkAccess
);

router.get("/public-docs/:text", getPublicDocs);


/* ADMIN */

router.get(
  "/requests",
  auth,
  listRequests
);

router.get(
  "/approve/:id",
  approve
);


router.get(
  "/deny/:id",
  deny
);
module.exports = router;