const TicketsModel = require("../models/TicketsSchema");

// CREATE - Create new ticket
const createTicket = (req, res) => {
    const { title, description, project, priority, type, estimatedTime } = req.body;

    if (!title || !description || !project || !priority || !type || !estimatedTime) {
        res.status(400).json("All fields are required");
        return;
    }

    const ticket = {
        title,
        description,
        project,
        ticketAuthor: req.userId.email,
        priority,
        status: "new",
        type,
        estimatedTime,
        assignedDevs: [],
        comments: [],
    };

    TicketsModel.create(ticket)
        .then((docs) => {
            res.status(201).json({
                message: "Successfully Added a New Ticket",
                ticket: docs,
            });
            console.log("Successfully Created Ticket");
        })
        .catch((err) => {
            console.log(`Error: ` + err);
            res.status(500).json("Failed to create ticket");
        });
};

// READ - Get all tickets
const getAllTickets = (req, res) => {
    TicketsModel.find({}, (err, docs) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error fetching tickets");
        } else {
            if (docs.length === 0) {
                res.json("No Documents Found");
            } else {
                console.log("Sending Tickets");
                res.json(docs);
            }
        }
    });
};

// READ - Get single ticket by ID
const getTicketById = (req, res) => {
    const { id } = req.params;

    TicketsModel.findById(id, (err, doc) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error fetching ticket");
        } else {
            if (!doc) {
                res.status(404).json("Ticket not found");
            } else {
                res.json(doc);
            }
        }
    });
};

// UPDATE - Update ticket details
const updateTicket = (req, res) => {
    const { id, title, description, priority, type, estimatedTime, project } = req.body;

    if (!id) {
        res.status(400).json("Ticket ID is required");
        return;
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority;
    if (type) updateData.type = type;
    if (estimatedTime) updateData.estimatedTime = estimatedTime;
    if (project) updateData.project = project;

    TicketsModel.updateOne(
        { _id: id },
        updateData,
        (err, doc) => {
            if (err) {
                console.log(`Error: ` + err);
                res.status(500).json("Failed to update ticket");
            } else {
                res.json("Successfully Updated Ticket");
                console.log("Successfully Updated Ticket");
            }
        }
    );
};

// UPDATE - Update ticket status
const updateStatus = (req, res) => {
    const { id, status } = req.body;

    if (!id || !status) {
        res.status(400).json("Ticket ID and status are required");
        return;
    }

    console.log(req.body.status);
    TicketsModel.updateOne(
        { _id: id },
        { status },
        (err, doc) => {
            if (err) {
                console.log(`Error: ` + err);
                res.status(500).json("Failed to update status");
            } else {
                res.json("Successfully Updated Status");
                console.log("Successfully Updated Status");
            }
        }
    );
};

// UPDATE - Add developer to ticket
const addDevs = async (req, res) => {
    const { id, newDev } = req.body;

    if (!id || !newDev) {
        res.status(400).json("Ticket ID and developer email are required");
        return;
    }

    try {
        // Find the ticket
        const ticket = await TicketsModel.findById(id);
        if (!ticket) {
            res.status(404).json("Ticket not found");
            return;
        }

        // Find the project and verify the developer is a team member
        const project = await ProjectsModel.findById(ticket.project);
        if (!project) {
            res.status(404).json("Project not found");
            return;
        }

        // Check if newDev is either the creator or in the team array
        const isTeamMember = project.creator === newDev || 
                            (project.team && project.team.includes(newDev));

        if (!isTeamMember) {
            res.status(403).json("Developer is not a member of this project");
            return;
        }

        // Add developer to ticket
        const result = await TicketsModel.updateOne(
            { _id: id },
            { $addToSet: { assignedDevs: newDev } }
        );

        res.json("Successfully Added Developer to Ticket");
        console.log("Successfully Added Developer to Ticket");
    } catch (err) {
        console.log(`Error: ` + err);
        res.status(500).json("Failed to add developer");
    }
};

// UPDATE - Remove developer from ticket
const removeDev = async (req, res) => {
    const { id, devEmail } = req.body;

    if (!id || !devEmail) {
        res.status(400).json("Ticket ID and developer email are required");
        return;
    }

    try {
        const result = await TicketsModel.updateOne(
            { _id: id },
            { $pull: { assignedDevs: devEmail } }
        );

        res.json("Successfully Removed Developer");
        console.log("Successfully Removed Developer");
    } catch (err) {
        console.log(`Error: ` + err);
        res.status(500).json("Failed to remove developer");
    }
};


// UPDATE - Add comment to ticket
const addComment = (req, res) => {
    const { id, comment } = req.body;

    if (!id || !comment) {
        res.status(400).json("Ticket ID and comment are required");
        return;
    }

    console.log(req.body.comment);
    TicketsModel.updateOne(
        { _id: id },
        {
            $push: {
                comments: {
                    author: req.userId.email,
                    comment: comment,
                },
            },
        },
        (err, doc) => {
            if (err) {
                console.log(`Error: ` + err);
                res.status(500).json("Failed to add comment");
            } else {
                res.json("Successfully Added Comment to Ticket");
                console.log("Successfully Added Comment to Ticket");
            }
        }
    );
};

// DELETE - Delete comment from ticket
const deleteComment = (req, res) => {
    const { id, commentIndex } = req.body;

    if (!id || commentIndex === undefined) {
        res.status(400).json("Ticket ID and comment index are required");
        return;
    }

    TicketsModel.findById(id, (err, ticket) => {
        if (err || !ticket) {
            res.status(404).json("Ticket not found");
            return;
        }

        ticket.comments.splice(commentIndex, 1);
        ticket.save((saveErr) => {
            if (saveErr) {
                console.log(`Error: ` + saveErr);
                res.status(500).json("Failed to delete comment");
            } else {
                res.json("Successfully Deleted Comment");
                console.log("Successfully Deleted Comment");
            }
        });
    });
};

// DELETE - Delete ticket
const deleteTicket = (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.status(400).json("Ticket ID is required");
        return;
    }

    TicketsModel.deleteOne({ _id: id }, (err, result) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Failed to delete ticket");
        } else {
            if (result.deletedCount === 0) {
                res.status(404).json("Ticket not found");
            } else {
                res.json("Successfully Deleted Ticket");
                console.log("Successfully Deleted Ticket");
            }
        }
    });
};

const getTicketsByProject = (req, res) => {
    const { projectId } = req.params;

    TicketsModel.find({ project: projectId }, (err, docs) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error fetching tickets");
        } else {
            res.json(docs);
        }
    });
};

// READ - Get tickets assigned to current user
const getMyAssignedTickets = (req, res) => {
    const userEmail = req.userId.email;

    TicketsModel.find({ assignedDevs: userEmail }, (err, docs) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error fetching tickets");
        } else {
            res.json(docs);
        }
    });
};

const getProjectById = (req, res) => {
    const { id } = req.params;
    ProjectsModel.findById(id, (err, doc) => {
        if (err) return res.status(500).json("Error fetching project");
        if (!doc) return res.status(404).json("Project not found");
        res.json(doc);
    });
};

module.exports = {
    getProjectById,
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
};