import axios from "axios";
import './UserProfile.css';
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button } from "@mui/material";

interface props {
  id: string;
  email: string;
  role: string;
  dateRegistered?: string;
  ipAddress?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const UserProfile = ({
  id,
  email,
  role,
  dateRegistered,
  ipAddress,
  onEdit,
  onDelete,
}: props) => {
  const [cookies] = useCookies<any>(["user"]);
  const [isBanning, setIsBanning] = useState(false);
  const [banSuccess, setBanSuccess] = useState(false);

  const handleBanUser = async () => {
    setIsBanning(true);
    try {
      const response = await axios.post(
        (process.env.REACT_APP_LOCAL_API_URL ||
          "https://bug-tracker-dkyu.onrender.com/") + "banUser",
        {
          ip: ipAddress,
        },
        {
          headers: {
            "x-access-token": cookies.AuthToken,
            email: cookies.Email,
          },
        }
      );
      console.log(response);
      setBanSuccess(true);
      setTimeout(() => setBanSuccess(false), 3000);
    } catch (error) {
      console.error("Error banning user:", error);
    } finally {
      setIsBanning(false);
    }
  };

  const getRoleBadgeColor = (userRole: string) => {
    switch (userRole.toLowerCase()) {
      case "admin":
        return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
      case "developer":
        return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
      case "user":
        return "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
      default:
        return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
  };

  return (
    <div className="user-profile-card">
      <div className="card-header" style={{ background: getRoleBadgeColor(role) }}>
        <div className="user-avatar">
          <PersonIcon style={{ fontSize: "2rem" }} />
        </div>
        <div className="header-info">
          <h3 className="user-email">{email}</h3>
          <div className="role-badge">{role}</div>
        </div>
      </div>

      <div className="card-body">
        <div className="info-item">
          <div className="info-icon">
            <BadgeIcon fontSize="small" />
          </div>
          <div className="info-content">
            <span className="info-label">User ID</span>
            <span className="info-value">{id}</span>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <EmailIcon fontSize="small" />
          </div>
          <div className="info-content">
            <span className="info-label">Email</span>
            <span className="info-value">{email}</span>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <CalendarTodayIcon fontSize="small" />
          </div>
          <div className="info-content">
            <span className="info-label">Registered</span>
            <span className="info-value registered">
              {dateRegistered ? dateRegistered : "No Date Found"}
            </span>
          </div>
        </div>

        <div className="info-item">
          <div className="info-icon">
            <LocationOnIcon fontSize="small" />
          </div>
          <div className="info-content">
            <span className="info-label">IP Address</span>
            <span className="info-value ip-address">
              {ipAddress ? ipAddress : "No Address Found"}
            </span>
          </div>
        </div>
      </div>

      {ipAddress && (
        <div className="card-footer">
          <div className="action-buttons">
            {onEdit && (
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={onEdit}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "rgba(102,126,234,0.1)" },
                }}
              >
                Edit
              </Button>
            )}

            {onDelete && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={onDelete}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "rgba(245,101,101,0.1)" },
                }}
              >
                Delete
              </Button>
            )}
          </div>

          {banSuccess ? (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              disabled
              fullWidth
              sx={{ 
                textTransform: "none", 
                borderRadius: 2, 
                fontWeight: 600,
                mt: 1.5
              }}
            >
              User Banned Successfully
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              startIcon={<BlockIcon />}
              onClick={handleBanUser}
              disabled={isBanning}
              fullWidth
              sx={{ 
                textTransform: "none", 
                borderRadius: 2, 
                fontWeight: 600,
                mt: 1.5
              }}
            >
              {isBanning ? "Banning..." : "Ban IP Address"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;