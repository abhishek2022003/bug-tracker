const express = require("express");
const router = express.Router();
const {
    createProject,
    getAllProjects,
    getProjectById,
    getProjectsByCreator,
    updateProject,
    deleteProject,
    addTeamMember,
    removeTeamMember,
    searchProjects,
    getProjectStats,
} = require("../controllers/project.controller");
const { verifyJWT } = require("../middleware/auth");
const { createProjectLimiter } = require("../middleware/rateLimiter");

// Project CRUD routes
router.post("/createProject", verifyJWT, createProjectLimiter, createProject);
router.get("/getAllProjects", verifyJWT, getAllProjects);
router.get("/getProject/:id", verifyJWT, getProjectById);
router.get("/getMyProjects", verifyJWT, getProjectsByCreator);
router.post("/updateProject", verifyJWT, updateProject);
router.post("/deleteProject", verifyJWT, deleteProject);

// Team management routes
router.post("/addTeamMember", verifyJWT, addTeamMember);
router.post("/removeTeamMember", verifyJWT, removeTeamMember);

// Additional routes
router.get("/searchProjects", verifyJWT, searchProjects);
router.get("/getProjectStats/:id", verifyJWT, getProjectStats);

module.exports = router;