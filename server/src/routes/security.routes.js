const express = require("express");
const router = express.Router();
const { userSecurity } = require("../controllers/security.controller");

router.get("/userSecurity", userSecurity);

module.exports = router;