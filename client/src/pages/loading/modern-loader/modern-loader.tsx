import React from "react";
import "./modern-loader.css";

const ModernLoader = () => {
    return (
        <>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "200px",
                    height: "200px",
                }}
            >
                <svg
                    width="200"
                    height="200"
                    viewBox="0 0 200 200"
                    style={{
                        animation: "rotate 2s linear infinite",
                    }}
                >
                    <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="8"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="8"
                        strokeDasharray="400"
                        strokeDashoffset="400"
                        strokeLinecap="round"
                        style={{
                            animation: "dash 1.5s ease-in-out infinite",
                        }}
                    />
                </svg>

                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "120px",
                        height: "120px",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "50%",
                        animation: "pulse 2s ease-in-out infinite",
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "60px",
                        height: "60px",
                        background: "#ffffff",
                        borderRadius: "50%",
                        animation: "pulse 2s ease-in-out infinite reverse",
                    }}
                />
            </div>

            <div
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    zIndex: 1,
                }}
            >
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                            borderRadius: "50%",
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>
        </>
    );
};

export default ModernLoader;