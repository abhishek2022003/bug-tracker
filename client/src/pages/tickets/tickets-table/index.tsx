import React, { useState, useEffect } from "react";
import "./index.css";
import { Checkbox, TablePagination } from "@mui/material";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { ProjectsModel } from "../../projects/interface";
import { TicketsModel } from "../interface";
import { formatDate } from "../../../utils/api";

const TicketTable = ({
    setSelectedFilteredTicket,
    setShowFullDescription,
}: any) => {
    const [cookies] = useCookies<any>(["user"]);

    const allProjects = useSelector(
        (state: { allProjects: { value: [ProjectsModel] } }) =>
            state.allProjects.value
    );

    const allTickets = useSelector(
        (state: { tickets: { value: [TicketsModel] } }) => state.tickets.value
    );

    const selectedProject = useSelector(
        (state: { selectedProject: { value: string } }) =>
            state.selectedProject.value
    );

    useEffect(() => {
        if (selectedProject) {
            const projectTicketsFilter = allTickets?.filter(
                (tickets) => tickets.project === selectedProject
            );
            setFilteredTickets(projectTicketsFilter);
        } else {
            const userTicketsFilter = allTickets?.filter(
                (tickets) => tickets.ticketAuthor === cookies.Email
            );
            setFilteredTickets(userTicketsFilter);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allTickets, selectedProject]);

    const [filteredTickets, setFilteredTickets] = useState([{}]);
    const [resolvedFilterOn, setResolvedFilterOn] = useState<Boolean>(true);

    const handleResolvedFilter = () => {
        setPage(0);
        setResolvedFilterOn((prevValue) => !prevValue);
    };

    const [unresolvedTickets, setUnresolvedTickets] = useState<TicketsModel[]>([]);

    useEffect(() => {
        const onlyUnresolved = filteredTickets?.filter(
            (ticket: { status?: string }) => {
                return ticket?.status !== "resolved";
            }
        );
        setUnresolvedTickets(onlyUnresolved);
    }, [filteredTickets]);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "new":
                return "#0891b2";
            case "in progress":
                return "#d97706";
            case "resolved":
                return "#16a34a";
            default:
                return "#718096";
        }
    };

    const displayTickets = resolvedFilterOn ? unresolvedTickets : filteredTickets;

    return (
        <div className="ticket-table-container">
            <div className="table-wrapper">
                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th>Ticket Title</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayTickets
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((ticket: TicketsModel, index: number) => (
                                <tr
                                    key={index}
                                    onClick={() => {
                                        setSelectedFilteredTicket(ticket);
                                        setShowFullDescription(false);
                                    }}
                                >
                                    <td className="ticket-title">{ticket.title}</td>
                                    <td className="ticket-description">
                                        {ticket.description}
                                    </td>
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor: getStatusColor(ticket.status),
                                            }}
                                        >
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="ticket-date">
                                        {ticket?.createdAt
                                            ? formatDate(ticket?.createdAt)
                                            : "--"}
                                    </td>
                                    <td className="ticket-author">{ticket.ticketAuthor}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            <div className="table-footer">
                <div className="filter-section">
                    <label className="filter-label">
                        <Checkbox
                            size="small"
                            checked={!resolvedFilterOn}
                            onChange={handleResolvedFilter}
                            sx={{
                                padding: 0,
                                marginRight: '0.5rem',
                                color: '#667eea',
                                '&.Mui-checked': {
                                    color: '#667eea',
                                }
                            }}
                        />
                        Show Resolved Tickets
                    </label>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={displayTickets.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        '.MuiTablePagination-select': {
                            borderRadius: '8px',
                        },
                        '.MuiTablePagination-actions button': {
                            color: '#667eea',
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default TicketTable;