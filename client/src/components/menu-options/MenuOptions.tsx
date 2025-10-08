import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MenuOptions.css";

interface props {
    link: string;
    label: string;
    Icon: any;
    setToggleMenu: React.Dispatch<React.SetStateAction<Boolean>>;
}

const MenuOptions = ({ link, label, Icon, setToggleMenu }: props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname === link;

    const handleClick = () => {
        navigate(link);
        setToggleMenu(false);
    };

    return (
        <div 
            className={`menu-option ${isActive ? 'active' : ''}`}
            onClick={handleClick}
        >
            <div className="menu-icon">
                <Icon data-testid="icon" />
            </div>
            <h3 className="menu-label">{label}</h3>

            <style>{`
                .menu-option {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    margin-bottom: 0.5rem;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: rgba(255, 255, 255, 0.8);
                    position: relative;
                    overflow: hidden;
                }

                .menu-option::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: white;
                    transform: scaleY(0);
                    transition: transform 0.3s ease;
                }

                .menu-option:hover {
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                    transform: translateX(4px);
                }

                .menu-option:hover::before {
                    transform: scaleY(1);
                }

                .menu-option.active {
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }

                .menu-option.active::before {
                    transform: scaleY(1);
                }

                .menu-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                }

                .menu-label {
                    margin: 0;
                    font-size: 1rem;
                    font-weight: 500;
                    letter-spacing: 0.01em;
                }

                .menu-option.active .menu-label {
                    font-weight: 600;
                }

                @media (max-width: 700px) {
                    .menu-option {
                        padding: 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default MenuOptions;