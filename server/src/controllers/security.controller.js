const BannedIPsModel = require("../models/BannedIPSchema");
const { getClientIp } = require("../utils/helpers");

const userSecurity = async (req, res) => {
    const clientIp = getClientIp(req);

    const bannedUser = await BannedIPsModel.findOne({
        ip: clientIp,
    });

    if (bannedUser) {
        console.log("Banned User Detected");
        return res.status(403).json({ status: "banned", message: "You are banned" });
    }

    console.log("✅ Valid User:", clientIp);
    return res.status(200).json({ status: "ok", message: "Valid Credentials" });
};

module.exports = {
    userSecurity,
};