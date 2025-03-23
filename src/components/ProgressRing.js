import React from "react";
import "./ProgressRing.css";

export default function ProgressRing({
    progress,
    size = 200,
    strokeWidth = 10,
    label,
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="progress-ring-container">
            <svg
                className="progress-ring"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background circle */}
                <circle
                    className="progress-ring-circle-bg"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="none"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress circle */}
                <circle
                    className="progress-ring-circle"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
            {label && <div className="progress-ring-label">{label}</div>}
        </div>
    );
}
