const UsersModel = require("../models/UsersSchema");
const BannedIPsModel = require("../models/BannedIPSchema");
const bcrypt = require("bcryptjs");

// READ - Get all users (Admin only)
const getUsers = (req, res) => {
    if (req.userId.role != "admin") {
        res.status(403).json("Not Admin");
        console.log("Not Admin");
        return;
    }
    console.log("Admin Verified, Fetching Users");

    UsersModel.find({}, (err, docs) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error fetching users");
        } else {
            if (docs.length === 0) {
                res.json("No Documents Found");
            } else {
                res.json(docs);
            }
        }
    });
};

// READ - Get single user by ID (Admin only)
const getUserById = (req, res) => {
    if (req.userId.role != "admin") {
        res.status(403).json("Not Admin");
        console.log("Not Admin");
        return;
    }

    const { id } = req.params;

    UsersModel.findById(id, (err, doc) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error fetching user");
        } else {
            if (!doc) {
                res.status(404).json("User not found");
            } else {
                res.json(doc);
            }
        }
    });
};

// UPDATE - Update user details (Admin only)
const updateUser = async (req, res) => {
    if (req.userId.role != "admin") {
        res.status(403).json("Not Admin");
        console.log("Not Admin");
        return;
    }

    const { id, email, role } = req.body;

    if (!id) {
        res.status(400).json("User ID is required");
        return;
    }

    try {
        // Check if email already exists for another user
        if (email) {
            const existingUser = await UsersModel.findOne({
                email: email.toLowerCase(),
                _id: { $ne: id },
            });

            if (existingUser) {
                res.status(409).json("Email already exists");
                return;
            }
        }

        const updateData = {};
        if (email) updateData.email = email.toLowerCase();
        if (role) updateData.role = role;

        UsersModel.updateOne(
            { _id: id },
            updateData,
            (err, result) => {
                if (err) {
                    console.log(`Error: ` + err);
                    res.status(500).json("Failed to update user");
                } else {
                    res.json("Successfully Updated User");
                    console.log("Successfully Updated User");
                }
            }
        );
    } catch (err) {
        console.log(`Error: ` + err);
        res.status(500).json("Failed to update user");
    }
};

// UPDATE - Change user password (Admin only)
const changeUserPassword = async (req, res) => {
    if (req.userId.role != "admin") {
        res.status(403).json("Not Admin");
        console.log("Not Admin");
        return;
    }

    const { id, newPassword } = req.body;

    if (!id || !newPassword) {
        res.status(400).json("User ID and new password are required");
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        UsersModel.updateOne(
            { _id: id },
            { password: hashedPassword },
            (err, result) => {
                if (err) {
                    console.log(`Error: ` + err);
                    res.status(500).json("Failed to change password");
                } else {
                    res.json("Successfully Changed Password");
                    console.log("Successfully Changed Password");
                }
            }
        );
    } catch (err) {
        console.log(`Error: ` + err);
        res.status(500).json("Failed to change password");
    }
};

// UPDATE - Change user role (Admin only)
const changeUserRole = (req, res) => {
    if (req.userId.role != "admin") {
        res.status(403).json("Not Admin");
        console.log("Not Admin");
        return;
    }

    const { id, role } = req.body;

    if (!id || !role) {
        res.status(400).json("User ID and role are required");
        return;
    }

    if (!["admin", "developer", "project manager"].includes(role)) {
        res.status(400).json("Invalid role");
        return;
    }

    UsersModel.updateOne(
        { _id: id },
        { role: role },
        (err, result) => {
            if (err) {
                console.log(`Error: ` + err);
                res.status(500).json("Failed to change role");
            } else {
                res.json("Successfully Changed User Role");
                console.log("Successfully Changed User Role");
            }
        }
    );
};

// DELETE - Delete user (Admin only)
const deleteUser = (req, res) => {
    if (req.userId.role != "admin") {
        res.status(403).json("Not Admin");
        console.log("Not Admin");
        return;
    }

    const { id } = req.body;

    if (!id) {
        res.status(400).json("User ID is required");
        return;
    }

    // Prevent admin from deleting themselves
    if (req.userId._id === id) {
        res.status(400).json("Cannot delete your own account");
        return;
    }

    UsersModel.deleteOne({ _id: id }, (err, result) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Failed to delete user");
        } else {
            if (result.deletedCount === 0) {
                res.status(404).json("User not found");
            } else {
                res.json("Successfully Deleted User");
                console.log("Successfully Deleted User");
            }
        }
    });
};

// CREATE - Create new user (Admin only)
const createUser = async (req, res) => {
    if (req.userId.role != "admin") {
        res.status(403).json("Not Admin");
        console.log("Not Admin");
        return;
    }

    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        res.status(400).json("Email, password, and role are required");
        return;
    }

    const sanitizedEmail = email.toLowerCase();

    try {
        const existingUser = await UsersModel.findOne({
            email: sanitizedEmail,
        });

        if (existingUser) {
            res.status(409).json("User already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Get Current Date
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
        const dateRegistered = mm + "/" + dd + "/" + yyyy + " - " + time;

        const user = {
            email: sanitizedEmail,
            password: hashedPassword,
            role: role,
            dateRegistered: dateRegistered,
            ipAddress: req.ip || "N/A",
        };

        UsersModel.create(user).then((docs) => {
            res.status(201).json({
                message: "Successfully Created User",
                user: {
                    id: docs._id,
                    email: docs.email,
                    role: docs.role,
                },
            });
            console.log("Successfully Created User");
        });
    } catch (err) {
        console.log(`Error: ` + err);
        res.status(500).json("Failed to create user");
    }
};

// Ban user by IP (Admin only)
const banUser = (req, res) => {
    if (req.userId.role != "admin") {
        res.status(403).json("Not Admin");
        console.log("Not Admin");
        return;
    }
    console.log("Admin Verified, Banning User...");

    const { ip } = req.body;

    if (!ip) {
        res.status(400).json("IP address is required");
        return;
    }

    BannedIPsModel.create({ ip }).then((docs) => {
        res.json("Successfully Banned User");
        console.log("Successfully Banned User");
    }).catch((err) => {
        console.log(`Error: ` + err);
        res.status(500).json("Failed to ban user");
    });
};

// Unban user by IP (Admin only)
const unbanUser = (req, res) => {
    if (req.userId.role != "admin") {
        res.status(403).json("Not Admin");
        console.log("Not Admin");
        return;
    }
    console.log("Admin Verified, Unbanning User...");

    const { ip } = req.body;

    if (!ip) {
        res.status(400).json("IP address is required");
        return;
    }

    BannedIPsModel.deleteOne({ ip }, (err, result) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Failed to unban user");
        } else {
            if (result.deletedCount === 0) {
                res.status(404).json("IP not found in banned list");
            } else {
                res.json("Successfully Unbanned User");
                console.log("Successfully Unbanned User");
            }
        }
    });
};

// Get all banned IPs (Admin only)
const getBannedIPs = (req, res) => {
    if (req.userId.role != "admin") {
        res.status(403).json("Not Admin");
        console.log("Not Admin");
        return;
    }

    BannedIPsModel.find({}, (err, docs) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error fetching banned IPs");
        } else {
            res.json(docs);
        }
    });
};

module.exports = {
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
};