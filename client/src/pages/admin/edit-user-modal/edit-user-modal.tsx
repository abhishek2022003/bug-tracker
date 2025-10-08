import React, { useState, useEffect } from "react";
import "./edit-user-modal.css";
import Modal from "@mui/material/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import FormHelperText from "@mui/material/FormHelperText";
import Autocomplete from "@mui/material/Autocomplete";
import { TextField, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { updateUser, changeUserPassword } from "../service";
import { UserModel } from "../interface";

interface EditUserModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: UserModel | null;
    onUpdate: () => void;
}

const EditUserModal = ({ open, setOpen, user, onUpdate }: EditUserModalProps) => {
    const [email, setEmail] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (user) {
            setEmail(user.email || "");
            setRole(user.role || "");
            setNewPassword("");
        }
    }, [user]);

    const handleUpdateUser = async () => {
        if (!email || !role) {
            setError("Email and role are required");
            return;
        }

        if (newPassword && newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!user?._id) {
            setError("User ID is missing");
            return;
        }

        setError("");
        setLoadingButton(true);

        try {
            // Update email and role
            await updateUser({
                id: user._id,
                email,
                role,
            });

            // Update password if provided
            if (newPassword) {
                await changeUserPassword({
                    id: user._id,
                    newPassword,
                });
            }

            setLoadingButton(false);
            onUpdate();
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setLoadingButton(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setError("");
        setNewPassword("");
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
                    <h3>Edit User</h3>
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
                            <label className="form-label">New Password (optional)</label>
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Leave blank to keep current password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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
                        onClick={handleUpdateUser}
                    >
                        Update User
                    </LoadingButton>
                </div>
            </Box>
        </Modal>
    );
};

export default EditUserModal;