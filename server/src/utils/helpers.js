const getCurrentDateTime = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    const time =
        today.getHours() +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds();
    return mm + "/" + dd + "/" + yyyy + " - " + time;
};

const getClientIp = (req) => {
    const ip = require("ip");
    return (
        req.ip ||
        (req.headers["x-forwarded-for"] || "").split(",")[0] ||
        ip.address()
    );
};

module.exports = {
    getCurrentDateTime,
    getClientIp,
};