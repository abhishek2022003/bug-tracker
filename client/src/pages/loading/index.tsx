import React, { useEffect, useState } from "react";
import { clearAllStorage } from "../../utils/api";
import ModernLoader from "./modern-loader/modern-loader";

const Loading = () => {
    const handleRefresh = () => {
        window.location.reload();
    };

    const [complete5Seconds, setComplete5Seconds] = useState<boolean>(false);
    const [complete10Seconds, setComplete10Seconds] = useState<boolean>(false);
    const [complete20Seconds, setComplete20Seconds] = useState<boolean>(false);
    const [complete1Minute, setComplete1Minute] = useState<boolean>(false);

    useEffect(() => {
        const delay5Sec = setTimeout(() => {
            setComplete5Seconds(true);
        }, 5000);
        const delay10Sec = setTimeout(() => {
            setComplete10Seconds(true);
            clearAllStorage();
        }, 10000);
        const delay20Sec = setTimeout(() => {
            setComplete20Seconds(true);
        }, 20000);
        const delay1Min = setTimeout(() => {
            setComplete1Minute(true);
        }, 60000);
        return () => {
            clearTimeout(delay5Sec);
            clearTimeout(delay10Sec);
            clearTimeout(delay20Sec);
            clearTimeout(delay1Min);
        };
    }, []);

    return (
        <div
            style={{
                height: "100dvh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <ModernLoader />
            
            <div
                style={{
                    position: "relative",
                    zIndex: 10,
                    textAlign: "center",
                    color: "#ffffff",
                    maxWidth: "600px",
                    padding: "2rem",
                }}
            >
                <div
                    style={{
                        fontSize: "2.5rem",
                        fontWeight: "700",
                        marginBottom: "1.5rem",
                        textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    }}
                >
                    {complete5Seconds
                        ? "Initializing Services..."
                        : "Preparing Application..."}
                </div>

                {complete10Seconds && (
                    <div
                        style={{
                            fontSize: "1.2rem",
                            marginBottom: "1rem",
                            opacity: 0.9,
                            animation: "fadeIn 0.5s ease-in",
                        }}
                    >
                        This may take up to a minute
                    </div>
                )}

                {complete20Seconds && (
                    <div
                        style={{
                            fontSize: "1rem",
                            marginBottom: "1.5rem",
                            opacity: 0.85,
                            animation: "fadeIn 0.5s ease-in",
                        }}
                    >
                        Thank you for your patience...
                    </div>
                )}

                {complete1Minute && (
                    <button
                        onClick={handleRefresh}
                        style={{
                            padding: "0.75rem 2rem",
                            fontSize: "1rem",
                            fontWeight: "600",
                            color: "#667eea",
                            backgroundColor: "#ffffff",
                            border: "none",
                            borderRadius: "50px",
                            cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                            transition: "all 0.3s ease",
                            animation: "fadeIn 0.5s ease-in",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
                        }}
                    >
                        Refresh Page
                    </button>
                )}
            </div>
        </div>
    );
};

export default Loading;