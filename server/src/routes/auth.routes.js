const express = require("express");
const router = express.Router();
const { register, login, isUserAuth } = require("../controllers/auth.controller");
const { verifyJWT } = require("../middleware/auth");
const { registerLimiter } = require("../middleware/rateLimiter");

router.post("/register", registerLimiter, register);
router.post("/login", login);
router.get("/isUserAuth", verifyJWT, isUserAuth);

module.exports = router;