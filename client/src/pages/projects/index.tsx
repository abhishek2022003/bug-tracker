import React, { useState } from "react";
import "./index.css";
import Modal from "@mui/material/Modal";
import LoadingButton from "@mui/lab/LoadingButton";
import FormHelperText from "@mui/material/FormHelperText";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { setProjects } from "../../features/allProjectsSlice";
import { setSelectedProject } from "../../features/selectedProjectSlice";
import { useNavigate } from "react-router-dom";
import { ProjectsModel } from "./interface";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  createProject,
  getAllProjects,
  deleteProject,
  searchProjects,
} from "./service";
import EditProjectModal from "./edit-project-modal/edit-project-modal";

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cookies] = useCookies<any>(["user"]);

  const allProjects = useSelector(
    (state: { allProjects: { value: ProjectsModel[] } }) =>
      state.allProjects.value
  );

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // New Project States
  const [newProjectTitle, setNewProjectTitle] = useState<string>("");
  const [newProjectDescription, setNewProjectDescription] =
    useState<string>("");
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [newProjectErr, setNewProjectErr] = useState<string>("");

  // Menu and selected project for actions
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedProjectForAction, setSelectedProjectForAction] =
    useState<ProjectsModel | null>(null);
  const menuOpen = Boolean(anchorEl);

  // Modal Controllers
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Search functionality
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      try {
        const response = await searchProjects(query);
        if (response && response.length > 0) {
          dispatch(setProjects(response));
        }
      } catch (err) {
        console.error("Search error:", err);
      }
      setIsSearching(false);
    } else {
      getProjects();
    }
  };

  // Add New Project
  const addNewProject = async () => {
    if (!newProjectTitle || !newProjectDescription) {
      setNewProjectErr("Please Complete All Fields");
      return;
    } else {
      setNewProjectErr("");
    }
    setLoadingButton(true);

    try {
      const response = await createProject({
        title: newProjectTitle,
        description: newProjectDescription,
      });
      console.log(response);
      setLoadingButton(false);
      getProjects();
      handleClose();
    } catch (err) {
      if (err instanceof Error) {
        setNewProjectErr(err.message);
        setLoadingButton(false);
      } else {
        setNewProjectErr(String(err));
        setLoadingButton(false);
      }
    }
  };

  const getProjects = async () => {
    const response = await getAllProjects();
    if (response !== "No Documents Found") {
      dispatch(setProjects(response));
    }
  };

  // Delete Project
  const handleDeleteProject = async () => {
    if (!selectedProjectForAction || !selectedProjectForAction._id) return;

    try {
      await deleteProject({ id: selectedProjectForAction._id });
      setDeleteDialogOpen(false);
      setAnchorEl(null);
      setSelectedProjectForAction(null);
      await getProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setNewProjectTitle("");
    setNewProjectDescription("");
    setNewProjectErr("");
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    project: ProjectsModel
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProjectForAction(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    setEditOpen(true);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  // Navigate to project tickets
  const handleNavigateToProject = (title: string | undefined) => {
    dispatch(setSelectedProject(title));
    navigate("/tickets");
  };

  // Check if user can edit/delete project
  const canModifyProject = (project: ProjectsModel) => {
    return project.creator === cookies.Email || cookies.Role === "admin";
  };

  // Pagination Controls
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(9);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(allProjects.length / rowsPerPage);
  const displayedProjects = allProjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="projects-container">
      {/* Header */}
      <header className="projects-header">
        <div className="header-content">
          <div className="header-left">
            <div className="icon-wrapper">
              <AssignmentIcon />
            </div>
            <div>
              <h2 className="header-title">Projects</h2>
              <p className="header-subtitle">
                {allProjects.length} total projects
              </p>
            </div>
          </div>
          <button className="add-project-btn" onClick={() => setOpen(true)}>
            <AddIcon />
            <span>New Project</span>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search projects by title..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <IconButton
              size="small"
              onClick={() => {
                setSearchQuery("");
                getProjects();
              }}
              className="clear-search-btn"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-content">
        <div className="projects-grid">
         {displayedProjects.map((project, index) => (
    <div
        key={index}
        className="project-card"
    >
        <div className="card-header">
            <div className="card-icon">
                <AssignmentIcon />
            </div>
            <h3 
                className="card-title"
                onClick={() => handleNavigateToProject(project.title)}
            >
                {project.title}
            </h3>
            {/* TEMPORARILY ALWAYS SHOW - Remove canModifyProject check */}
            <IconButton
                className="menu-btn"
                onClick={(e) => handleMenuClick(e, project)}
                size="small"
            >
                <MoreVertIcon />
            </IconButton>
        </div>
        <div className="card-body" onClick={() => handleNavigateToProject(project.title)}>
            <div className="card-description">
                <DescriptionIcon fontSize="small" />
                <p>{project.description}</p>
            </div>
        </div>
        <div className="card-footer" onClick={() => handleNavigateToProject(project.title)}>
            <div className="card-author">
                <PersonIcon fontSize="small" />
                <span>{project.creator}</span>
            </div>
            <div className="card-arrow">→</div>
        </div>
    </div>
))}
        </div>

        {displayedProjects.length === 0 && (
          <div className="empty-state">
            <AssignmentIcon style={{ fontSize: "4rem", opacity: 0.3 }} />
            <p>No projects found</p>
            {searchQuery && (
              <button
                className="clear-filters-btn"
                onClick={() => {
                  setSearchQuery("");
                  getProjects();
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Custom Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
            >
              Previous
            </button>
            <div className="pagination-info">
              <span>
                Page {page + 1} of {totalPages}
              </span>
            </div>
            <button
              className="pagination-btn"
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            minWidth: "180px",
          },
        }}
      >
        <MenuItem
          onClick={handleEditClick}
          sx={{ gap: "0.75rem", padding: "0.75rem 1.25rem" }}
        >
          <EditIcon fontSize="small" />
          Edit Project
        </MenuItem>
        <MenuItem
          onClick={handleDeleteClick}
          sx={{
            gap: "0.75rem",
            padding: "0.75rem 1.25rem",
            color: "#f56565",
            "&:hover": {
              backgroundColor: "rgba(245, 101, 101, 0.1)",
            },
          }}
        >
          <DeleteIcon fontSize="small" />
          Delete Project
        </MenuItem>
      </Menu>

      {/* Add Project Modal */}
      <Modal open={open} onClose={handleClose} className="project-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Create New Project</h3>
            <button className="close-btn" onClick={handleClose}>
              <CloseIcon />
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input
                type="text"
                className={`form-input ${
                  newProjectErr && !newProjectTitle ? "error" : ""
                }`}
                placeholder="Enter project title"
                maxLength={20}
                onChange={(e) => setNewProjectTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className={`form-textarea ${
                  newProjectErr && !newProjectDescription ? "error" : ""
                }`}
                placeholder="Enter project description"
                rows={4}
                onChange={(e) => setNewProjectDescription(e.target.value)}
              />
            </div>

            {newProjectErr && (
              <FormHelperText error className="error-message">
                {newProjectErr}
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
              onClick={addNewProject}
            >
              Create Project
            </LoadingButton>
          </div>
        </div>
      </Modal>

      {/* Edit Project Modal */}
      <EditProjectModal
        open={editOpen}
        setOpen={setEditOpen}
        project={selectedProjectForAction}
        onUpdate={getProjects}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "1rem",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#2d3748" }}>
          Delete Project?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#4a5568" }}>
            Are you sure you want to delete "{selectedProjectForAction?.title}"?
            This action cannot be undone. All associated tickets and data will
            remain but will no longer be linked to this project.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "#718096",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteProject}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #f56565 0%, #c53030 100%)",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                background: "linear-gradient(135deg, #c53030 0%, #9b2c2c 100%)",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Projects;
