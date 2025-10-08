const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersModel = require("../models/UsersSchema");
const { getCurrentDateTime, getClientIp } = require("../utils/helpers");

const register = async (req, res) => {
    const { email, password, adminCode } = req.body;
    const sanitizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const clientIp = getClientIp(req);

    const existingUser = await UsersModel.findOne({ email: sanitizedEmail });
    if (existingUser) {
        return res.status(409).send("User Already Registered, Please Login");
    }

    // Assign role based on admin code
    const role =
        adminCode && adminCode === process.env.ADMIN_CODE ? "admin" : "developer";

    const user = await UsersModel.create({
        email: sanitizedEmail,
        password: hashedPassword,
        role,
        dateRegistered: getCurrentDateTime(),
        ipAddress: clientIp,
    });

    const token = jwt.sign(user.toJSON(), process.env.JWTSECRET, {
        expiresIn: "24hrs",
    });
    res.status(201).json({ token, email: sanitizedEmail, role });
};


const login = async (req, res) => {
    const { email, password } = req.body;
    const sanitizedEmail = email.toLowerCase();

    const user = await UsersModel.findOne({
        email: sanitizedEmail,
    });

    if (!user) {
        console.log("No User Found");
        res.status(400).send(
            "Invalid Credentials, Check Username and Password"
        );
        return;
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
        console.log("Wrong Password");
    }

    if (user && correctPassword) {
        console.log(`Logging In - ${email}`);
        const token = jwt.sign(user.toJSON(), process.env.JWTSECRET, {
            expiresIn: "24h",
        });
        res.status(201).json({ token, email: sanitizedEmail });
        return;
    }
    res.status(400).send("Invalid Credentials, Check Username and Password");
};

const isUserAuth = (req, res) => {
    console.log("Logging In");
    res.send("Yo, u are authenticated. Congrats!");
};

module.exports = {
    register,
    login,
    isUserAuth,
};