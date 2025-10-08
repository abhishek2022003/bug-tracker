import React, { useState, useMemo } from "react";
import "./index.css";
import { Divider, TextField, MenuItem, Select, InputLabel, FormControl, IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { TicketsModel } from "../../tickets/interface";
import StatusCell from "./status-cell";
import LastUpdate from "./last-update-cell";

const RecentActivity = () => {
    const allTickets = useSelector(
        (state: { tickets: { value: [TicketsModel] } }) => state.tickets.value
    );

    // Filter and Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [projectFilter, setProjectFilter] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    // Get unique values for filters
    const uniqueProjects = useMemo(() => {
        return Array.from(new Set(allTickets.map((ticket) => ticket.project)));
    }, [allTickets]);

    const uniqueTypes = useMemo(() => {
        return Array.from(new Set(allTickets.map((ticket) => ticket.type)));
    }, [allTickets]);

    // Filter and search logic
    const filteredTickets = useMemo(() => {
        let filtered = [...allTickets];

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter((ticket) => ticket.status === statusFilter);
        }

        // Apply type filter
        if (typeFilter !== "all") {
            filtered = filtered.filter((ticket) => ticket.type === typeFilter);
        }

        // Apply project filter
        if (projectFilter !== "all") {
            filtered = filtered.filter((ticket) => ticket.project === projectFilter);
        }

        // Apply search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (ticket) =>
                    ticket.title?.toLowerCase().includes(query) ||
                    ticket.project?.toLowerCase().includes(query) ||
                    ticket.ticketAuthor?.toLowerCase().includes(query) ||
                    ticket.description?.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [allTickets, searchQuery, statusFilter, typeFilter, projectFilter]);

    // Sort by most recent
    const recentTickets = useMemo(() => {
        return filteredTickets
            .filter((ticket) => ticket?.updatedAt)
            ?.sort(
                (a: any, b: any) =>
                    new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf()
            )
            .slice(0, 10); // Show top 10 instead of 4
    }, [filteredTickets]);

    const resolvedTickets = allTickets.filter(
        (ticket) => ticket.status === "resolved"
    );

    const inProgressTickets = allTickets.filter(
        (ticket) => ticket.status === "in progress"
    );

    const clearAllFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setTypeFilter("all");
        setProjectFilter("all");
    };

    const hasActiveFilters = searchQuery || statusFilter !== "all" || typeFilter !== "all" || projectFilter !== "all";

    return (
        <div className="recent-activity-card">
            <div className="activity-header">
                <div>
                    <h1 className="activity-title">Recent Activity</h1>
                    <span className="activity-subtitle">
                        <b className="active-count">
                            {resolvedTickets.length + inProgressTickets.length} Active,
                        </b>{" "}
                        proceed to resolve them
                    </span>
                </div>
                <div className="stats-summary">
                    <div className="stat-box resolved-stat">
                        <h1>{resolvedTickets.length}</h1>
                        <h5>Resolved</h5>
                    </div>
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <div className="stat-box progress-stat">
                        <h1>{inProgressTickets.length}</h1>
                        <h5>In-Progress</h5>
                    </div>
                </div>
            </div>

            <Divider style={{ margin: "1.5rem 0" }} />

            {/* Search and Filter Section */}
            <div className="search-filter-container">
                <div className="search-bar">
                    <SearchIcon className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search tickets by title, project, author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    {searchQuery && (
                        <IconButton
                            size="small"
                            onClick={() => setSearchQuery("")}
                            className="clear-search-btn"
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    )}
                </div>

                <button
                    className="filter-toggle-btn"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <FilterListIcon fontSize="small" />
                    Filters
                    {hasActiveFilters && <span className="filter-badge">●</span>}
                </button>
            </div>

            {/* Filter Dropdowns */}
            {showFilters && (
                <div className="filters-panel">
                    <div className="filter-group">
                        <label className="filter-label">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="in progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Type</label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Types</option>
                            {uniqueTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Project</label>
                        <select
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Projects</option>
                            {uniqueProjects.map((project) => (
                                <option key={project} value={project}>
                                    {project}
                                </option>
                            ))}
                        </select>
                    </div>

                    {hasActiveFilters && (
                        <button className="clear-filters-btn" onClick={clearAllFilters}>
                            <ClearIcon fontSize="small" />
                            Clear All
                        </button>
                    )}
                </div>
            )}

            {/* Results Count */}
            <div className="results-info">
                Showing <b>{recentTickets.length}</b> of <b>{filteredTickets.length}</b> tickets
            </div>

            <Divider style={{ margin: "1rem 0" }} />

            <div className="table-container">
                {recentTickets.length > 0 ? (
                    <table className="activity-table">
                        <thead>
                            <tr>
                                <th>Project</th>
                                <th>Ticket</th>
                                <th align="right">Type</th>
                                <th align="right">Author</th>
                                <th align="right">Status</th>
                                <th align="right">Last Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTickets.map(
                                (ticket: TicketsModel, index: number) => (
                                    <tr key={index}>
                                        <td>{ticket.project}</td>
                                        <td>{ticket.title}</td>
                                        <td align="right">{ticket.type}</td>
                                        <td align="right">{ticket.ticketAuthor}</td>
                                        <td align="right">
                                            <StatusCell status={ticket.status!} />
                                        </td>
                                        <td align="right">
                                            <LastUpdate updatedAt={ticket.updatedAt} />
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-results">
                        <p>No tickets found matching your search criteria</p>
                        <button className="clear-filters-btn" onClick={clearAllFilters}>
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentActivity;