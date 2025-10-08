import React from "react";
import { StatusCellProps } from "./interface";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const StatusCell = ({ status }: StatusCellProps) => {
    const backgroundColor = () => {
        switch (status) {
            case "new":
                return "#e6fffa";
            case "in progress":
                return "#fef5e7";
            case "resolved":
                return "#f0fff4";
            default:
                return "";
        }
    };

    const textColor = () => {
        switch (status) {
            case "new":
                return "#0891b2";
            case "in progress":
                return "#d97706";
            case "resolved":
                return "#16a34a";
            default:
                return "";
        }
    };

    const icon = () => {
        switch (status) {
            case "new":
                return <AddCircleOutlineIcon fontSize="small" />;
            case "in progress":
                return <AccessTimeIcon fontSize="small" />;
            case "resolved":
                return <CheckCircleOutlineIcon fontSize="small" />;
            default:
                return "";
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span
                style={{
                    backgroundColor: backgroundColor(),
                    color: textColor(),
                    whiteSpace: "nowrap",
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    borderRadius: "20px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                }}
            >
                {icon()}
                {status}
            </span>
        </div>
    );
};

export default StatusCell;