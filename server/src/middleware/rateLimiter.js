const rateLimit = require("express-rate-limit");

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 Hour
    max: 5, // Max 5 Request Per 1 Hour
    message: "Too many accounts created, please try again after an hour",
});

const createProjectLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 Min
    max: 5, // Max 5 Request Per 30 Min
    message: "Too many projects created, please wait 30 minutes",
});

const createTicketLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 Min
    max: 10, // Max 10 Request Per 30 Min
    message: "Too many tickets created, please wait 30 minutes",
});

module.exports = {
    registerLimiter,
    createProjectLimiter,
    createTicketLimiter,
};