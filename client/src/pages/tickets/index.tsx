import React, { useState, useEffect } from "react";
import "./index.css";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { setTickets } from "../../features/ticketsSlice";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getAllTickets } from "../../service";
import {
  addComment,
  addDevs,
  updateStatus,
  removeDev,
  deleteComment,
  deleteTicket,
  getProjectById,
} from "./service";
import PestControlIcon from "@mui/icons-material/PestControl";
import ConstructionIcon from "@mui/icons-material/Construction";
import HardwareIcon from "@mui/icons-material/Hardware";
import TicketTable from "./tickets-table";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import AddTicketModal from "./tickets-table/add-ticket-modal/add-ticket-modal";
import EditTicketModal from "./tickets-table/edit-ticket-modal/edit-ticket-modal";
import { TicketsModel } from "./interface";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Alert,
  Autocomplete,
  TextField,
  Chip,
} from "@mui/material";

interface TeamMember {
  email: string;
  role: string;
}

const Tickets = () => {
  const [cookies] = useCookies<any>(["user"]);
  const dispatch = useDispatch();

  const getTickets = async () => {
    const response = await getAllTickets();
    dispatch(setTickets(response));
  };

  const [selectedFilteredTicket, setSelectedFilteredTicket] = useState<any>({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const [assignError, setAssignError] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Fetch project team members when ticket is selected
  useEffect(() => {
    if (selectedFilteredTicket?.project) {
      fetchProjectTeam(selectedFilteredTicket.project);
    }
  }, [selectedFilteredTicket?.project]);

  const fetchProjectTeam = async (projectId: string) => {
    try {
      const project = await getProjectById(projectId);
      const members: TeamMember[] = [];

      // Add creator
      if (project.creator) {
        members.push({ email: project.creator, role: "Creator" });
      }

      // Add team members
      if (project.team && project.team.length > 0) {
        project.team.forEach((email: string) => {
          members.push({ email, role: "Team Member" });
        });
      }

      setTeamMembers(members);
    } catch (err) {
      console.error("Error fetching team:", err);
    }
  };

  const handleChangeStatus = async (e: { target: { value: string } }) => {
    const response = await updateStatus({
      id: selectedFilteredTicket?._id,
      status: e.target.value,
    });
    const updatedStatusObj = {
      ...selectedFilteredTicket,
      status: e.target.value,
    };
    setSelectedFilteredTicket(updatedStatusObj);
    getTickets();
  };

  const [newDev, setNewDev] = useState<string>("");

  const handleOpenAssignModal = () => {
    setOpenAssignModal(true);
    setAssignError("");
    setSelectedTeamMember(null);
  };

  const handleAssignDeveloper = async () => {
    if (!selectedTeamMember) {
      setAssignError("Please select a team member");
      return;
    }

    if (selectedFilteredTicket?.assignedDevs?.includes(selectedTeamMember.email)) {
      setAssignError("This developer is already assigned");
      return;
    }

    setIsAssigning(true);
    setAssignError("");

    try {
      await addDevs({
        id: selectedFilteredTicket?._id,
        newDev: selectedTeamMember.email,
      });

      await getTickets();

      setSelectedFilteredTicket((prevValue: any) => ({
        ...prevValue,
        assignedDevs: [...(prevValue?.assignedDevs || []), selectedTeamMember.email],
      }));

      setOpenAssignModal(false);
      setSelectedTeamMember(null);
    } catch (error: any) {
      console.error("Error assigning developer:", error);
      setAssignError(
        error.response?.data || "Failed to assign developer. Only project team members can be assigned."
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const addNewDev = async () => {
    if (selectedFilteredTicket?.assignedDevs?.includes(newDev)) {
      alert("Developer already assigned");
      return;
    }
    if (!selectedFilteredTicket._id) return;
    if (!newDev.trim()) return;

    try {
      const response = await addDevs({
        id: selectedFilteredTicket?._id,
        newDev: newDev,
      });

      await getTickets();

      setSelectedFilteredTicket((prevValue: any) => ({
        ...prevValue,
        assignedDevs: [...(prevValue?.assignedDevs || []), newDev],
      }));

      setNewDev("");
    } catch (error: any) {
      console.error("Error adding developer:", error);
      alert(
        error.response?.data || "Failed to add developer. Only project team members can be assigned."
      );
    }
  };

  const handleRemoveDev = async (devEmail: string) => {
    if (!selectedFilteredTicket._id) return;

    try {
      await removeDev({
        id: selectedFilteredTicket._id,
        devEmail: devEmail,
      });

      const updatedDevs = selectedFilteredTicket.assignedDevs.filter(
        (dev: string) => dev !== devEmail
      );

      setSelectedFilteredTicket((prevValue: any) => ({
        ...prevValue,
        assignedDevs: updatedDevs,
      }));

      await getTickets();
    } catch (error) {
      console.error("Error removing developer:", error);
    }
  };

  const [newComment, setNewComment] = useState<string>("");

  const addNewComment = async () => {
    if (!selectedFilteredTicket._id) return;
    if (!newComment.trim()) return;

    const response = await addComment({
      id: selectedFilteredTicket?._id,
      comment: newComment,
    });
    const updatedStatusObj = {
      ...selectedFilteredTicket,
      comments: [
        ...(selectedFilteredTicket?.comments || []),
        { author: cookies.Email, comment: newComment },
      ],
    };

    setSelectedFilteredTicket(updatedStatusObj);
    setNewComment("");
    getTickets();
  };

  const handleDeleteComment = async (commentIndex: number) => {
    if (!selectedFilteredTicket._id) return;

    try {
      await deleteComment({
        id: selectedFilteredTicket._id,
        commentIndex: commentIndex,
      });

      const updatedComments = [...selectedFilteredTicket.comments];
      updatedComments.splice(commentIndex, 1);

      setSelectedFilteredTicket((prevValue: any) => ({
        ...prevValue,
        comments: updatedComments,
      }));

      await getTickets();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedFilteredTicket._id) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ticket "${selectedFilteredTicket.title}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteTicket({ id: selectedFilteredTicket._id });
      setSelectedFilteredTicket({});
      await getTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  const handleEditTicket = () => {
    setOpenEditModal(true);
  };

  const handleUpdateTicket = async () => {
    await getTickets();

    // Refresh the selected ticket with updated data
    if (selectedFilteredTicket?._id) {
      const allTicketsResponse = await getAllTickets();
      const updatedTicket = allTicketsResponse.find(
        (ticket: TicketsModel) => ticket._id === selectedFilteredTicket._id
      );
      if (updatedTicket) {
        setSelectedFilteredTicket(updatedTicket);
      }
    }
  };

  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

  const renderDescription = () => {
    if (
      selectedFilteredTicket?.description?.length > 45 &&
      !showFullDescription
    ) {
      return (
        <>
          {selectedFilteredTicket?.description.substring(0, 30)}...
          <span
            onClick={() => setShowFullDescription(true)}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              color: "#667eea",
              fontWeight: "600",
            }}
          >
            See More
          </span>
        </>
      );
    } else {
      return selectedFilteredTicket?.description;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Low":
        return "#48bb78";
      case "Medium":
        return "#ed8936";
      case "High":
        return "#f56565";
      default:
        return "#718096";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Issue":
        return <ConstructionIcon />;
      case "Bug Fix":
        return <PestControlIcon />;
      default:
        return <HardwareIcon />;
    }
  };

  // Filter out already assigned developers
  const availableTeamMembers = teamMembers.filter(
    (member) => !selectedFilteredTicket?.assignedDevs?.includes(member.email)
  );

  return (
    <div className="tickets-container">
      {/* Header */}
      <header className="tickets-header">
        <div className="header-content">
          <div className="header-left">
            <div className="icon-wrapper">
              <ConfirmationNumberIcon />
            </div>
            <h2 className="header-title">My Tickets</h2>
          </div>
          <button
            className="add-ticket-btn"
            onClick={() => setOpenAddModal(true)}
          >
            <AddIcon />
            <span>New Ticket</span>
          </button>
        </div>
      </header>

      {/* Ticket Table */}
      <TicketTable
        setSelectedFilteredTicket={setSelectedFilteredTicket}
        setShowFullDescription={setShowFullDescription}
      />

      {/* Ticket Info and Comments */}
      <div className="details-container">
        {/* Ticket Info Panel */}
        <div className="info-panel">
          <div className="panel-header info-header">
            <h3>Ticket Details</h3>
            {selectedFilteredTicket?.title && (
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <span className="ticket-badge">
                  {selectedFilteredTicket?.title}
                </span>
                <IconButton
                  size="small"
                  onClick={handleEditTicket}
                  sx={{
                    color: "white",
                    "&:hover": { background: "rgba(255,255,255,0.2)" },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleDeleteTicket}
                  sx={{
                    color: "white",
                    "&:hover": { background: "rgba(255,255,255,0.2)" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </div>
            )}
          </div>
          {selectedFilteredTicket?.title ? (
            <div className="panel-body">
              <div className="info-grid">
                <div className="info-item">
                  <label>Priority</label>
                  <div
                    className="priority-badge"
                    style={{
                      background: getPriorityColor(
                        selectedFilteredTicket?.priority
                      ),
                      color: "white",
                    }}
                  >
                    {selectedFilteredTicket?.priority}
                  </div>
                </div>

                <div className="info-item">
                  <label>Author</label>
                  <div className="info-value">
                    {selectedFilteredTicket?.ticketAuthor}
                  </div>
                </div>

                <div className="info-item description-item">
                  <label>Description</label>
                  <div className="info-value description-text">
                    {renderDescription()}
                  </div>
                </div>

                <div className="info-item">
                  <label>Type</label>
                  <div className="type-badge">
                    {getTypeIcon(selectedFilteredTicket?.type)}
                    <span>{selectedFilteredTicket?.type}</span>
                  </div>
                </div>

                <div className="info-item">
                  <label>Estimated Time</label>
                  <div className="info-value">
                    {selectedFilteredTicket?.estimatedTime} hrs
                  </div>
                </div>

                <div className="info-item">
                  <label>Status</label>
                  <Select
                    value={selectedFilteredTicket?.status || ""}
                    onChange={handleChangeStatus}
                    className="status-select"
                    size="small"
                    sx={{
                      borderRadius: "10px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e2e8f0",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#667eea",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#667eea",
                      },
                    }}
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="in progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </div>
              </div>

              <div className="devs-section">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <label>Assigned Developers</label>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PersonAddIcon />}
                    onClick={handleOpenAssignModal}
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      textTransform: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      "&:hover": {
                        background: "linear-gradient(135deg, #5568d3 0%, #6b3f99 100%)",
                      },
                    }}
                  >
                    Assign from Team
                  </Button>
                </div>

                {/* Manual Input (Optional - can be removed if only team members should be assigned) */}
                <div className="add-dev-input" style={{ marginBottom: "0.75rem" }}>
                  <input
                    value={newDev}
                    type="text"
                    placeholder="Or enter email manually"
                    onChange={(e) => setNewDev(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addNewDev();
                    }}
                  />
                  <button onClick={addNewDev} className="add-dev-btn">
                    <PersonAddIcon fontSize="small" />
                  </button>
                </div>

                <div className="devs-list">
                  {selectedFilteredTicket?.assignedDevs?.length > 0 ? (
                    selectedFilteredTicket.assignedDevs.map(
                      (dev: string, index: number) => (
                        <div key={index} className="dev-chip">
                          <span>{dev}</span>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveDev(dev)}
                            sx={{
                              padding: "2px",
                              marginLeft: "4px",
                              "&:hover": { color: "#f56565" },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </div>
                      )
                    )
                  ) : (
                    <div style={{ 
                      padding: "1rem", 
                      textAlign: "center", 
                      color: "#718096",
                      fontSize: "0.875rem"
                    }}>
                      No developers assigned yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <ConfirmationNumberIcon
                style={{ fontSize: "4rem", opacity: 0.3 }}
              />
              <p>Select a ticket to view details</p>
            </div>
          )}
        </div>

        {/* Comments Panel */}
        <div className="comments-panel">
          <div className="panel-header comments-header">
            <h3>Comments</h3>
          </div>
          {selectedFilteredTicket?.title ? (
            <div className="panel-body comments-body">
              <div className="add-comment">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addNewComment();
                  }}
                  className="comment-form"
                >
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button type="submit" className="send-btn">
                    <SendIcon fontSize="small" />
                  </button>
                </form>
              </div>
              <div className="comments-list">
                {selectedFilteredTicket?.comments
                  ?.slice(0)
                  ?.reverse()
                  ?.map(
                    (
                      comment: { author: string; comment: string },
                      index: number
                    ) => {
                      const actualIndex =
                        selectedFilteredTicket.comments.length - 1 - index;
                      return (
                        <div key={index} className="comment-item">
                          <div className="comment-avatar">
                            {comment.author.charAt(0).toUpperCase()}
                          </div>
                          <div className="comment-content">
                            <div className="comment-header">
                              <div className="comment-author">
                                {comment.author}
                              </div>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteComment(actualIndex)}
                                sx={{
                                  padding: "4px",
                                  "&:hover": { color: "#f56565" },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </div>
                            <div className="comment-text">
                              {comment.comment}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <SendIcon style={{ fontSize: "4rem", opacity: 0.3 }} />
              <p>No comments yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Developer Modal */}
      <Dialog open={openAssignModal} onClose={() => setOpenAssignModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PersonAddIcon />
            Assign Team Member
          </div>
        </DialogTitle>
        <DialogContent>
          {assignError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {assignError}
            </Alert>
          )}

          {selectedFilteredTicket?.assignedDevs?.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ 
                fontSize: "0.875rem", 
                fontWeight: 600, 
                color: "#4a5568",
                display: "block",
                marginBottom: "0.5rem"
              }}>
                Currently Assigned:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {selectedFilteredTicket.assignedDevs.map((dev: string) => (
                  <Chip
                    key={dev}
                    label={dev}
                    onDelete={() => {
                      handleRemoveDev(dev);
                      setOpenAssignModal(false);
                    }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </div>
            </div>
          )}

          <Autocomplete
            options={availableTeamMembers}
            getOptionLabel={(option) => option.email}
            value={selectedTeamMember}
            onChange={(event, newValue) => {
              setSelectedTeamMember(newValue);
              setAssignError("");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Team Member"
                placeholder="Choose from project team"
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <div>
                  <div style={{ fontWeight: 500 }}>{option.email}</div>
                  <div style={{ fontSize: "0.75rem", color: "#718096" }}>
                    {option.role}
                  </div>
                </div>
              </li>
            )}
            noOptionsText={
              teamMembers.length === 0
                ? "No team members found for this project"
                : "All team members are already assigned"
            }
          />

          {teamMembers.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              No team members found for this project. Add team members to the project first.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignModal(false)}>Cancel</Button>
          <Button
            onClick={handleAssignDeveloper}
            variant="contained"
            disabled={isAssigning || !selectedTeamMember || availableTeamMembers.length === 0}
          >
            {isAssigning ? "Assigning..." : "Assign"}
          </Button>
        </DialogActions>
      </Dialog>

      <AddTicketModal open={openAddModal} setOpen={setOpenAddModal} />
      <EditTicketModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        ticket={selectedFilteredTicket}
        onUpdate={handleUpdateTicket}
      />
    </div>
  );
};

export default Tickets;