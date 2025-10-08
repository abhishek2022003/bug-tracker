import React, { useState } from "react";
import "./add-user-modal.css";
import Modal from "@mui/material/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import FormHelperText from "@mui/material/FormHelperText";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createUser } from "../service";

interface AddUserModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onUserAdded: () => void;
}

const AddUserModal = ({ open, setOpen, onUserAdded }: AddUserModalProps) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleAddUser = async () => {
        if (!email || !password || !role) {
            setError("Please complete all fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setError("");
        setLoadingButton(true);

        try {
            await createUser({ email, password, role });
            setLoadingButton(false);
            onUserAdded();
            handleClose();
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setLoadingButton(false);
        }
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setRole("");
    };

    const handleClose = () => {
        setOpen(false);
        setError("");
    };

    const roleOptions = ["admin", "developer", "project manager"];

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
                    <h3>Add New User</h3>
                    <button className="close-btn" onClick={handleClose}>
                        <CloseIcon />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-input ${error && !email ? "error" : ""}`}
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className={`form-input ${error && !password ? "error" : ""}`}
                                placeholder="Enter password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Role</label>
                            <Autocomplete
                                disablePortal
                                options={roleOptions}
                                value={role}
                                onChange={(e: any, value: any) => {
                                    if (value) setRole(value);
                                }}
                                renderInput={(params: any) => (
                                    <TextField
                                        {...params}
                                        placeholder="Choose role"
                                        error={!!error && !role}
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

                    {error && (
                        <FormHelperText error className="error-message">
                            {error}
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
                        onClick={handleAddUser}
                    >
                        Add User
                    </LoadingButton>
                </div>
            </Box>
        </Modal>
    );
};

export default AddUserModal;