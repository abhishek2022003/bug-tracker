const express = require("express");
const router = express.Router();
const {
    createTicket,
    getAllTickets,
    getTicketById,
    getTicketsByProject,
    getMyAssignedTickets,
    updateTicket,
    updateStatus,
    addDevs,
    removeDev,
    addComment,
    deleteComment,
    deleteTicket,
    getProjectById,
} = require("../controllers/ticket.controller");
const { verifyJWT } = require("../middleware/auth");
const { createTicketLimiter } = require("../middleware/rateLimiter");

router.post("/createTicket", verifyJWT, createTicketLimiter, createTicket);
router.get("/getAllTickets", verifyJWT, getAllTickets);
router.get("/getTicket/:id", verifyJWT, getTicketById);
router.get("/getTicketsByProject/:projectId", verifyJWT, getTicketsByProject);
router.get("/getMyAssignedTickets", verifyJWT, getMyAssignedTickets);
router.post("/updateTicket", verifyJWT, updateTicket);
router.post("/updateStatus", verifyJWT, updateStatus);
router.post("/deleteTicket", verifyJWT, deleteTicket);

router.post("/addDevs", verifyJWT, addDevs);
router.post("/removeDev", verifyJWT, removeDev);

router.post("/addComment", verifyJWT, addComment);
router.post("/deleteComment", verifyJWT, deleteComment);
router.get("/getProject/:id", getProjectById);


module.exports = router;