import React, { useState, useEffect } from "react";
import "./edit-project-modal.css";
import Modal from "@mui/material/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import FormHelperText from "@mui/material/FormHelperText";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateProject } from "../service";
import { ProjectsModel } from "../interface";

interface EditProjectModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    project: ProjectsModel | null;
    onUpdate: () => void;
}

const EditProjectModal = ({ open, setOpen, project, onUpdate }: EditProjectModalProps) => {
    const [projectTitle, setProjectTitle] = useState<string>("");
    const [projectDescription, setProjectDescription] = useState<string>("");
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [editProjectErr, setEditProjectErr] = useState<string>("");

    useEffect(() => {
        if (project) {
            setProjectTitle(project.title || "");
            setProjectDescription(project.description || "");
        }
    }, [project]);

    const updateExistingProject = async () => {
        if (!projectTitle || !projectDescription) {
            setEditProjectErr("Please Complete All Fields");
            return;
        }
        
        if (!project?._id) {
            setEditProjectErr("Project ID is missing");
            return;
        }
        
        setEditProjectErr("");
        setLoadingButton(true);

        try {
            const response = await updateProject({
                id: project._id,
                title: projectTitle,
                description: projectDescription,
            });
            console.log(response);
            setLoadingButton(false);
            onUpdate();
            handleClose();
        } catch (err) {
            if (err instanceof Error) {
                setEditProjectErr(err.message);
                setLoadingButton(false);
            } else {
                setEditProjectErr(String(err));
                setLoadingButton(false);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditProjectErr("");
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
            }}
        >
            <Box className="modal-content">
                <div className="modal-header">
                    <h3>Edit Project</h3>
                    <button className="close-btn" onClick={handleClose}>
                        <CloseIcon />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Project Title</label>
                        <input
                            type="text"
                            className={`form-input ${
                                editProjectErr && !projectTitle ? "error" : ""
                            }`}
                            placeholder="Enter project title"
                            maxLength={20}
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className={`form-textarea ${
                                editProjectErr && !projectDescription ? "error" : ""
                            }`}
                            placeholder="Enter project description"
                            rows={4}
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                        />
                    </div>

                    {editProjectErr && (
                        <FormHelperText error className="error-message">
                            {editProjectErr}
                        </FormHelperText>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={handleClose}>
                        Cancel
                    </button>
                    <LoadingButton
                        variant="contained"
                        loading={loadingButton}
                        className="submit-btn"
                        onClick={updateExistingProject}
                    >
                        Update Project
                    </LoadingButton>
                </div>
            </Box>
        </Modal>
    );
};

export default EditProjectModal;