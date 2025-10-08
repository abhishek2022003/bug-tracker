import React, { useState, SyntheticEvent } from "react";
import "./add-ticket-modal.css";
import Modal from "@mui/material/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import FormHelperText from "@mui/material/FormHelperText";
import { useDispatch, useSelector } from "react-redux";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAllTickets, createTicket } from "../../service";
import { setTickets } from "../../../../features/ticketsSlice";
import { ProjectsModel } from "../../../projects/interface";

const AddTicketModal = ({ open, setOpen }: any) => {
    const dispatch = useDispatch();

    const allProjects = useSelector(
        (state: { allProjects: { value: [ProjectsModel] } }) =>
            state.allProjects.value
    );

    const projectOptions = allProjects.map((project: any) => project.title);

    const addNewTicket = async () => {
        if (
            !ticketTitle ||
            !ticketDescription ||
            !ticketProject ||
            !priority ||
            !type ||
            !estimatedTime
        ) {
            setNewTicketErr("Please Complete All Fields");
            return;
        } else {
            setNewTicketErr("");
        }
        setLoadingButton(true);
        try {
            const response = await createTicket({
                title: ticketTitle,
                description: ticketDescription,
                project: ticketProject,
                priority: priority,
                type: type,
                estimatedTime: estimatedTime,
            });
            console.log(response);
            setLoadingButton(false);
            getTickets();
            handleClose();
        } catch (err) {
            if (err instanceof Error) {
                setNewTicketErr(err.message);
                setLoadingButton(false);
            } else {
                setNewTicketErr(String(err));
                setLoadingButton(false);
            }
        }
    };

    const getTickets = async () => {
        const response = await getAllTickets();
        dispatch(setTickets(response));
    };

    const handleClose = () => {
        setOpen(false);
        setTicketProject("");
        setTicketTitle("");
        setTicketDescription("");
        setPriority("");
        setType("");
        setEstimatedTime(0);
        setNewTicketErr("");
    };

    const priorityOptions = ["Low", "Medium", "High"];
    const typeOptions = ["Issue", "Bug Fix", "Feature Request"];
    const timeOptions = Array.from({ length: 24 }, (_, i) => String(i + 1));

    const [ticketProject, setTicketProject] = useState<string>("");
    const [ticketTitle, setTicketTitle] = useState<string>("");
    const [ticketDescription, setTicketDescription] = useState<string>("");
    const [priority, setPriority] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [estimatedTime, setEstimatedTime] = useState<number>(0);
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [newTicketErr, setNewTicketErr] = useState<String>("");

    return (
        <Modal 
            open={open} 
            onClose={handleClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
            }}
        >
            <Box className="modal-content">
                <div className="modal-header">
                    <h3>Create New Ticket</h3>
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
                                className={`form-input ${newTicketErr && !ticketTitle ? 'error' : ''}`}
                                placeholder="Enter ticket title"
                                maxLength={20}
                                onChange={(e) => setTicketTitle(e.target.value)}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Description</label>
                            <textarea
                                className={`form-textarea ${newTicketErr && !ticketDescription ? 'error' : ''}`}
                                placeholder="Enter ticket description"
                                rows={3}
                                onChange={(e) => setTicketDescription(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Project</label>
                            <Autocomplete
                                disablePortal
                                options={projectOptions[0] ? projectOptions : []}
                                onChange={(e: SyntheticEvent, value: null | string) => {
                                    if (value) setTicketProject(value);
                                }}
                                renderInput={(params: object) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose project"
                                        error={!!newTicketErr && !ticketProject}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '10px',
                                            }
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
                                onChange={(e: SyntheticEvent, value: string | null) => {
                                    if (value) setPriority(value);
                                }}
                                renderInput={(params: object) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose priority"
                                        error={!!newTicketErr && !priority}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '10px',
                                            }
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
                                onChange={(e: any, value: any) => {
                                    if (value) setType(value);
                                }}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose type"
                                        error={!!newTicketErr && !type}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '10px',
                                            }
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
                                onChange={(e: any, value: any) => {
                                    if (value) setEstimatedTime(value);
                                }}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose time"
                                        error={!!newTicketErr && !estimatedTime}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '10px',
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {newTicketErr && (
                        <FormHelperText error className="error-message">
                            {newTicketErr}
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
                        onClick={addNewTicket}
                    >
                        Create Ticket
                    </LoadingButton>
                </div>
            </Box>
        </Modal>
    );
};

export default AddTicketModal;