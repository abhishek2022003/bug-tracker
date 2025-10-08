const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (!token) {
        res.send("No Token Found!");
    } else {
        jwt.verify(token, process.env.JWTSECRET, (err, decodedUser) => {
            if (err) {
                res.json({ auth: false, message: "U failed to authenticate" });
            } else {
                req.userId = decodedUser;
                next();
            }
        });
    }
};

module.exports = { verifyJWT };