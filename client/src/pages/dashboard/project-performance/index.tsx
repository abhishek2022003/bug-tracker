import React, { useState, useEffect } from "react";
import "./index.css";
import { ResponsivePie } from "@nivo/pie";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import DoneOutlineOutlinedIcon from "@mui/icons-material/DoneOutlineOutlined";
import SidePanelOptions from "./side-panel/side-panel-options";
import { useSelector } from "react-redux";
import { TicketsModel } from "../../tickets/interface";
import { countTicketsPerProject } from "../../../utils/api";

const ProjectPerformance = () => {
    const allTickets = useSelector(
        (state: { tickets: { value: [TicketsModel] } }) => state.tickets.value
    );

    const data = countTicketsPerProject(allTickets);

    const principalProject = data.reduce((maxObject, obj) =>
        obj.value > maxObject.value ? obj : maxObject
    );

    const [selectedProject, setSelectedProject] = useState<string>("");
    const [newTickets, setnewTickets] = useState<number>(0);
    const [inProgress, setInProgress] = useState<number>(0);
    const [resolvedTickets, setResolvedTickets] = useState<number>(0);

    useEffect(() => {
        setnewTickets(principalProject.tickets.new);
        setInProgress(principalProject.tickets.inProgress);
        setResolvedTickets(principalProject.tickets.resolved);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [principalProject.value]);

    return (
        <div className="project-performance-card">
            <h3 className="card-title">Project Performance</h3>
            <div className="performance-content">
                <div className="chart-container">
                    <ResponsivePie
                        data={data}
                        margin={{ top: 20, bottom: 20 }}
                        innerRadius={0.6}
                        padAngle={2}
                        cornerRadius={4}
                        activeOuterRadiusOffset={12}
                        borderWidth={0}
                        colors={["#667eea", "#764ba2", "#f093fb", "#4facfe"]}
                        enableArcLinkLabels={false}
                        enableArcLabels={false}
                        legends={[]}
                        onClick={({ data }) => {
                            setSelectedProject(data.label);
                            setnewTickets(data.tickets.new);
                            setInProgress(data.tickets.inProgress);
                            setResolvedTickets(data.tickets.resolved);
                        }}
                    />
                </div>
                <div className="stats-container">
                    <SidePanelOptions
                        Icon={LeaderboardOutlinedIcon}
                        title={
                            selectedProject
                                ? "Selected Project"
                                : "Principal Project"
                        }
                        data={
                            selectedProject
                                ? selectedProject
                                : `${principalProject.label} - ${Math.round(
                                      (principalProject.value /
                                          allTickets.length) *
                                          100
                                  )}%`
                        }
                    />
                    <SidePanelOptions
                        Icon={AddCircleOutlineOutlinedIcon}
                        title="New Tickets"
                        data={newTickets}
                    />
                    <SidePanelOptions
                        Icon={BuildOutlinedIcon}
                        title="In Progress"
                        data={inProgress}
                    />
                    <SidePanelOptions
                        Icon={DoneOutlineOutlinedIcon}
                        title="Resolved Tickets"
                        data={resolvedTickets}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectPerformance;