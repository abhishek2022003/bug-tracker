import React from "react";
import "./side-panel-options.css";
import { SidePanelProps } from "../interface";

const SidePanelOptions = ({ Icon, title, data }: SidePanelProps) => {
    return (
        <div className="side-panel-option">
            <div className="option-icon">
                <Icon />
            </div>
            <div className="option-content">
                <h5 className="option-title">{title}</h5>
                <b className="option-data">{data}</b>
            </div>
        </div>
    );
};

export default SidePanelOptions;