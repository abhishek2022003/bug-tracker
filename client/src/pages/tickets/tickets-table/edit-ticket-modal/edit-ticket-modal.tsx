import React, { useState, useEffect, SyntheticEvent } from "react";
import "./edit-ticket-modal.css";
import Modal from "@mui/material/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import FormHelperText from "@mui/material/FormHelperText";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateTicket } from "../../service";
import { TicketsModel } from "../../interface";
import { ProjectsModel } from "../../../projects/interface";
import { useSelector } from "react-redux";

interface EditTicketModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    ticket: TicketsModel | null;
    onUpdate: () => void;
}

const EditTicketModal = ({ open, setOpen, ticket, onUpdate }: EditTicketModalProps) => {
    const allProjects = useSelector(
        (state: { allProjects: { value: ProjectsModel[] } }) =>
            state.allProjects.value
    );

    const projectOptions = allProjects.map((project: any) => project.title);

    const [ticketTitle, setTicketTitle] = useState<string>("");
    const [ticketDescription, setTicketDescription] = useState<string>("");
    const [ticketProject, setTicketProject] = useState<string>("");
    const [priority, setPriority] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [estimatedTime, setEstimatedTime] = useState<number>(0);
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [editTicketErr, setEditTicketErr] = useState<string>("");

    useEffect(() => {
        if (ticket) {
            setTicketTitle(ticket.title || "");
            setTicketDescription(ticket.description || "");
            setTicketProject(ticket.project || "");
            setPriority(ticket.priority || "");
            setType(ticket.type || "");
            // Fix: Convert Number to number
            setEstimatedTime(ticket.estimatedTime ? Number(ticket.estimatedTime) : 0);
        }
    }, [ticket]);

    const updateExistingTicket = async () => {
        if (!ticketTitle || !ticketDescription || !ticketProject || !priority || !type || !estimatedTime) {
            setEditTicketErr("Please Complete All Fields");
            return;
        }

        if (!ticket?._id) {
            setEditTicketErr("Ticket ID is missing");
            return;
        }

        setEditTicketErr("");
        setLoadingButton(true);

        try {
            const response = await updateTicket({
                id: ticket._id,
                title: ticketTitle,
                description: ticketDescription,
                project: ticketProject,
                priority: priority,
                type: type,
                estimatedTime: estimatedTime,
            });
            console.log(response);
            setLoadingButton(false);
            onUpdate();
            handleClose();
        } catch (err) {
            if (err instanceof Error) {
                setEditTicketErr(err.message);
                setLoadingButton(false);
            } else {
                setEditTicketErr(String(err));
                setLoadingButton(false);
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditTicketErr("");
    };

    const priorityOptions = ["Low", "Medium", "High"];
    const typeOptions = ["Issue", "Bug Fix", "Feature Request"];
    const timeOptions = Array.from({ length: 24 }, (_, i) => String(i + 1));

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
                    <h3>Edit Ticket</h3>
                    <button className="close-btn" onClick={handleClose}>
                        <CloseIcon />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Ticket Title</label>
                            <input
                                type="text"
                                className={`form-input ${editTicketErr && !ticketTitle ? "error" : ""}`}
                                placeholder="Enter ticket title"
                                maxLength={20}
                                value={ticketTitle}
                                onChange={(e) => setTicketTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Description</label>
                            <textarea
                                className={`form-textarea ${editTicketErr && !ticketDescription ? "error" : ""}`}
                                placeholder="Enter ticket description"
                                rows={3}
                                value={ticketDescription}
                                onChange={(e) => setTicketDescription(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Project</label>
                            <Autocomplete
                                disablePortal
                                options={projectOptions[0] ? projectOptions : []}
                                value={ticketProject}
                                onChange={(e: SyntheticEvent, value: null | string) => {
                                    if (value) setTicketProject(value);
                                }}
                                renderInput={(params: object) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose project"
                                        error={!!editTicketErr && !ticketProject}
                                        size="small"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "10px",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <Autocomplete
                                disablePortal
                                options={priorityOptions}
                                value={priority}
                                onChange={(e: SyntheticEvent, value: string | null) => {
                                    if (value) setPriority(value);
                                }}
                                renderInput={(params: object) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose priority"
                                        error={!!editTicketErr && !priority}
                                        size="small"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "10px",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <Autocomplete
                                disablePortal
                                options={typeOptions}
                                value={type}
                                onChange={(e: any, value: any) => {
                                    if (value) setType(value);
                                }}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose type"
                                        error={!!editTicketErr && !type}
                                        size="small"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "10px",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Estimated Time (hrs)</label>
                            <Autocomplete
                                disablePortal
                                options={timeOptions}
                                value={String(estimatedTime)}
                                onChange={(e: any, value: any) => {
                                    if (value) setEstimatedTime(Number(value));
                                }}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose time"
                                        error={!!editTicketErr && !estimatedTime}
                                        size="small"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "10px",
                                            },
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {editTicketErr && (
                        <FormHelperText error className="error-message">
                            {editTicketErr}
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
                        onClick={updateExistingTicket}
                    >
                        Update Ticket
                    </LoadingButton>
                </div>
            </Box>
        </Modal>
    );
};

export default EditTicketModal;