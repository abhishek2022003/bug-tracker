const ProjectsModel = require("../models/ProjectsSchema");

// CREATE - Create new project
const createProject = (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        res.status(400).json("Title and description are required");
        return;
    }

    const project = {
        title: title,
        description: description,
        creator: req.userId.email,
    };

    ProjectsModel.create(project)
        .then((docs) => {
            res.status(201).json({
                message: "Successfully Added a New Project",
                project: docs,
            });
            console.log("Successfully Created Project");
        })
        .catch((err) => {
            console.log(`Error: ` + err);
            res.status(500).json("Failed to create project");
        });
};

// READ - Get all projects
const getAllProjects = (req, res) => {
    ProjectsModel.find({}, (err, docs) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error fetching projects");
        } else {
            if (docs.length === 0) {
                res.json("No Documents Found");
            } else {
                res.json(docs);
            }
        }
    });
};

// READ - Get single project by ID
const getProjectById = (req, res) => {
    const { id } = req.params;

    ProjectsModel.findById(id, (err, doc) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error fetching project");
        } else {
            if (!doc) {
                res.status(404).json("Project not found");
            } else {
                res.json(doc);
            }
        }
    });
};

// READ - Get projects by creator
const getProjectsByCreator = (req, res) => {
    const creatorEmail = req.userId.email;

    ProjectsModel.find({ creator: creatorEmail }, (err, docs) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error fetching projects");
        } else {
            if (docs.length === 0) {
                res.json("No Projects Found");
            } else {
                res.json(docs);
            }
        }
    });
};

// UPDATE - Update project
const updateProject = (req, res) => {
    const { id, title, description } = req.body;

    if (!id) {
        res.status(400).json("Project ID is required");
        return;
    }

    // Check if user is the creator or admin
    ProjectsModel.findById(id, (err, project) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error finding project");
            return;
        }

        if (!project) {
            res.status(404).json("Project not found");
            return;
        }

        // Allow update if user is creator or admin
        if (project.creator !== req.userId.email && req.userId.role !== "admin") {
            res.status(403).json("Not authorized to update this project");
            return;
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;

        ProjectsModel.updateOne(
            { _id: id },
            updateData,
            (err, result) => {
                if (err) {
                    console.log(`Error: ` + err);
                    res.status(500).json("Failed to update project");
                } else {
                    res.json("Successfully Updated Project");
                    console.log("Successfully Updated Project");
                }
            }
        );
    });
};

// DELETE - Delete project
const deleteProject = (req, res) => {
    const { id } = req.body;

    if (!id) {
        res.status(400).json("Project ID is required");
        return;
    }

    // Check if user is the creator or admin
    ProjectsModel.findById(id, (err, project) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error finding project");
            return;
        }

        if (!project) {
            res.status(404).json("Project not found");
            return;
        }

        // Allow deletion if user is creator or admin
        if (project.creator !== req.userId.email && req.userId.role !== "admin") {
            res.status(403).json("Not authorized to delete this project");
            return;
        }

        ProjectsModel.deleteOne({ _id: id }, (err, result) => {
            if (err) {
                console.log(`Error: ` + err);
                res.status(500).json("Failed to delete project");
            } else {
                if (result.deletedCount === 0) {
                    res.status(404).json("Project not found");
                } else {
                    res.json("Successfully Deleted Project");
                    console.log("Successfully Deleted Project");
                }
            }
        });
    });
};

// UPDATE - Add team member to project
const addTeamMember = (req, res) => {
    const { id, memberEmail } = req.body;

    if (!id || !memberEmail) {
        res.status(400).json("Project ID and member email are required");
        return;
    }

    ProjectsModel.findById(id, (err, project) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error finding project");
            return;
        }

        if (!project) {
            res.status(404).json("Project not found");
            return;
        }

        // Allow if user is creator or admin
        if (project.creator !== req.userId.email && req.userId.role !== "admin") {
            res.status(403).json("Not authorized to modify this project");
            return;
        }

        // Check if team array exists, if not create it
        ProjectsModel.updateOne(
            { _id: id },
            { $addToSet: { team: memberEmail } }, // $addToSet prevents duplicates
            (err, result) => {
                if (err) {
                    console.log(`Error: ` + err);
                    res.status(500).json("Failed to add team member");
                } else {
                    res.json("Successfully Added Team Member");
                    console.log("Successfully Added Team Member");
                }
            }
        );
    });
};

// UPDATE - Remove team member from project
const removeTeamMember = (req, res) => {
    const { id, memberEmail } = req.body;

    if (!id || !memberEmail) {
        res.status(400).json("Project ID and member email are required");
        return;
    }

    ProjectsModel.findById(id, (err, project) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error finding project");
            return;
        }

        if (!project) {
            res.status(404).json("Project not found");
            return;
        }

        // Allow if user is creator or admin
        if (project.creator !== req.userId.email && req.userId.role !== "admin") {
            res.status(403).json("Not authorized to modify this project");
            return;
        }

        ProjectsModel.updateOne(
            { _id: id },
            { $pull: { team: memberEmail } },
            (err, result) => {
                if (err) {
                    console.log(`Error: ` + err);
                    res.status(500).json("Failed to remove team member");
                } else {
                    res.json("Successfully Removed Team Member");
                    console.log("Successfully Removed Team Member");
                }
            }
        );
    });
};

// READ - Search projects by title
const searchProjects = (req, res) => {
    const { query } = req.query;

    if (!query) {
        res.status(400).json("Search query is required");
        return;
    }

    ProjectsModel.find(
        { title: { $regex: query, $options: "i" } }, // Case-insensitive search
        (err, docs) => {
            if (err) {
                console.log(`Error: ` + err);
                res.status(500).json("Error searching projects");
            } else {
                res.json(docs);
            }
        }
    );
};

// READ - Get project statistics
const getProjectStats = (req, res) => {
    const { id } = req.params;

    ProjectsModel.findById(id, (err, project) => {
        if (err) {
            console.log(`Error: ` + err);
            res.status(500).json("Error fetching project");
            return;
        }

        if (!project) {
            res.status(404).json("Project not found");
            return;
        }

        // You can expand this to include ticket counts, team size, etc.
        const stats = {
            projectId: project._id,
            title: project.title,
            creator: project.creator,
            teamSize: project.team ? project.team.length : 0,
            createdAt: project.createdAt,
        };

        res.json(stats);
    });
};

module.exports = {
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
};