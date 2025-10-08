import React, { useState } from "react";
import "./SideNav.css";
import MenuOptions from "../menu-options/MenuOptions";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import AssignmentTwoToneIcon from "@mui/icons-material/AssignmentTwoTone";
import ConfirmationNumberTwoToneIcon from "@mui/icons-material/ConfirmationNumberTwoTone";
import AdminPanelSettingsTwoToneIcon from "@mui/icons-material/AdminPanelSettingsTwoTone";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { setSelectedProject } from "../../features/selectedProjectSlice";
import { logout } from "../../utils/api";

const SideNav = () => {
    const [toggleMenu, setToggleMenu] = useState<Boolean>(false);
    const dispatch = useDispatch();

    const handleTicketMenu = () => {
        dispatch(setSelectedProject(""));
    };

    return (
        <div className="sidenav-container">
            {/* Mobile Header */}
            <div className="mobile-header">
                <div className="logo-section">
                    <div className="logo-icon">BT</div>
                    <span className="logo-text">Bug Tracker</span>
                </div>
                <button 
                    className="menu-toggle"
                    onClick={() => setToggleMenu((prevValue) => !prevValue)}
                >
                    {toggleMenu ? (
                        <CloseIcon fontSize="medium" />
                    ) : (
                        <MenuIcon fontSize="medium" />
                    )}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className={`nav-menu ${toggleMenu ? 'show' : ''}`}>
                <div className="menu-header">
                    <div className="logo-icon-large">BT</div>
                    <h2 className="app-title">Bug Tracker</h2>
                    <p className="app-subtitle">Project Management</p>
                </div>

                <div className="menu-items">
                    <MenuOptions
                        label="Dashboard"
                        link="/"
                        Icon={HomeTwoToneIcon}
                        setToggleMenu={setToggleMenu}
                    />
                    <MenuOptions
                        label="Projects"
                        link="/projects"
                        Icon={AssignmentTwoToneIcon}
                        setToggleMenu={setToggleMenu}
                    />
                    <div onClick={handleTicketMenu}>
                        <MenuOptions
                            label="Tickets"
                            link="/tickets"
                            Icon={ConfirmationNumberTwoToneIcon}
                            setToggleMenu={setToggleMenu}
                        />
                    </div>
                    <MenuOptions
                        label="Administration"
                        link="/administration"
                        Icon={AdminPanelSettingsTwoToneIcon}
                        setToggleMenu={setToggleMenu}
                    />
                </div>

                <div className="logout-section">
                    <button className="logout-btn" onClick={logout}>
                        <LogoutIcon fontSize="small" />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>

            {/* Overlay for mobile */}
            {toggleMenu && <div className="overlay" onClick={() => setToggleMenu(false)} />}
        </div>
    );
};

export default SideNav;