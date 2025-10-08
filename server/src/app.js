const express = require("express");
const cors = require("cors");
const connectDatabase = require("./config/database");

// Routes
const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const ticketRoutes = require("./routes/ticket.routes");
const userRoutes = require("./routes/user.routes");
const securityRoutes = require("./routes/security.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.set("trust proxy", true);

// Connect to Database
connectDatabase();

// Routes
app.use("/", authRoutes);
app.use("/", projectRoutes);
app.use("/", ticketRoutes);
app.use("/", userRoutes);
app.use("/", securityRoutes);

// Health check
app.get("/pingServer", (req, res) => {
    res.send("Server Is Up!");
});

module.exports = app;