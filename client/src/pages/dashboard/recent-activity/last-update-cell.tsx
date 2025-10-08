import React from "react";
import { LastUpdateProps } from "./interface";
import { formatDate } from "../../../utils/api";

const LastUpdate = ({ updatedAt }: LastUpdateProps) => {
    return (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <span
                style={{
                    backgroundColor: "#f7fafc",
                    color: "#4a5568",
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    border: "1px solid #e2e8f0",
                }}
            >
                {formatDate(updatedAt!)}
            </span>
        </div>
    );
};

export default LastUpdate;