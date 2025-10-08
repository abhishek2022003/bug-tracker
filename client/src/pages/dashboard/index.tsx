import React from "react";
import "./index.css";
import HomeIcon from "@mui/icons-material/Home";
import ProjectPerformance from "./project-performance";
import TickeDistribution from "./ticket-distribution/ticket-distribution";
import RecentActivity from "./recent-activity";

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <h2 className="dashboard-title">
                    <HomeIcon style={{ marginRight: "1rem" }} />
                    Dashboard
                </h2>
            </header>
            {/* Top Container */}
            <RecentActivity />
            {/* Bottom Container */}
            <div className="dashboard-bottom">
                <ProjectPerformance />
                <TickeDistribution />
            </div>
        </div>
    );
};

export default Dashboard;