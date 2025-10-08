const express = require("express");
const router = express.Router();
const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    changeUserPassword,
    changeUserRole,
    deleteUser,
    banUser,
    unbanUser,
    getBannedIPs,
} = require("../controllers/user.controller");
const { verifyJWT } = require("../middleware/auth");

// User CRUD routes
router.get("/getUsers", verifyJWT, getUsers);
router.get("/getUser/:id", verifyJWT, getUserById);
router.post("/createUser", verifyJWT, createUser);
router.post("/updateUser", verifyJWT, updateUser);
router.post("/changeUserPassword", verifyJWT, changeUserPassword);
router.post("/changeUserRole", verifyJWT, changeUserRole);
router.post("/deleteUser", verifyJWT, deleteUser);

// Ban management routes
router.post("/banUser", verifyJWT, banUser);
router.post("/unbanUser", verifyJWT, unbanUser);
router.get("/getBannedIPs", verifyJWT, getBannedIPs);

module.exports = router;