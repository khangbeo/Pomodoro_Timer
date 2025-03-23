import React, { useState, useEffect } from "react";
import ChangeDuration from "./ChangeDuration";
import PlayPauseButtons from "./PlayPauseButtons";
import Display from "./Display";
import TaskList from "../components/TaskList";
import ProgressRing from "../components/ProgressRing";
import SoundManager from "../components/SoundManager";

function StatsDisplay({ stats }) {
    return (
        <div className="card stats-card mb-3">
            <div className="card-header bg-primary">
                <h2 className="h5 mb-0">Session Stats</h2>
            </div>
            <div className="card-body">
                <div className="stats-grid">
                    <div className="stat-item">
                        <i className="fa-solid fa-clock-rotate-left"></i>
                        <div className="stat-info">
                            <div className="stat-value">
                                {stats.focusCompleted}
                            </div>
                            <div className="stat-label">Focus Sessions</div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <i className="fa-solid fa-mug-hot"></i>
                        <div className="stat-info">
                            <div className="stat-value">
                                {stats.breakCompleted}
                            </div>
                            <div className="stat-label">Breaks Taken</div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <i className="fa-solid fa-fire"></i>
                        <div className="stat-info">
                            <div className="stat-value">
                                {stats.currentStreak}
                            </div>
                            <div className="stat-label">Current Streak</div>
                        </div>
                    </div>
                    <div className="stat-item">
                        <i className="fa-solid fa-stopwatch"></i>
                        <div className="stat-info">
                            <div className="stat-value">
                                {Math.floor(stats.totalFocusTime / 60)}m
                            </div>
                            <div className="stat-label">Total Focus Time</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Pomodoro() {
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [session, setSession] = useState(null);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const initialActiveState = {
        focusDuration: 25,
        breakDuration: 5,
        sessionActive: false,
    };
    const [activeState, setActiveState] = useState({ ...initialActiveState });

    // Stats tracking
    const [stats, setStats] = useState({
        focusCompleted: 0,
        breakCompleted: 0,
        currentStreak: 0,
        totalFocusTime: 0,
    });

    // Toggle focus mode
    const toggleFocusMode = () => {
        if (!isFocusMode) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.log(
                    "Error attempting to enable full-screen mode:",
                    err
                );
            });
        } else {
            document.exitFullscreen().catch((err) => {
                console.log("Error attempting to exit full-screen mode:", err);
            });
        }
        setIsFocusMode(!isFocusMode);
    };

    // Handle fullscreen change
    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsFocusMode(false);
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () =>
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
    }, []);

    /**
     * Called whenever the play/pause button is clicked.
     */
    function playPause() {
        setIsTimerRunning((prevState) => {
            const nextState = !prevState;
            if (nextState && !session) {
                setSession({
                    label: "Focusing",
                    timeRemaining: activeState.focusDuration * 60,
                });
                setActiveState({ ...activeState, sessionActive: true });
            }
            return nextState;
        });
    }

    function stop() {
        setSession(null);
        setActiveState({ ...initialActiveState });
        setIsTimerRunning(false);
    }

    // Handle session completion
    const handleSessionComplete = (label) => {
        if (label === "Focusing") {
            setStats((prev) => ({
                ...prev,
                focusCompleted: prev.focusCompleted + 1,
                currentStreak: prev.currentStreak + 1,
                totalFocusTime:
                    prev.totalFocusTime + activeState.focusDuration * 60,
            }));
        } else {
            setStats((prev) => ({
                ...prev,
                breakCompleted: prev.breakCompleted + 1,
            }));
        }
    };

    // Add keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event) => {
            // Ignore keyboard shortcuts if user is typing in an input
            if (
                event.target.tagName === "INPUT" ||
                event.target.tagName === "TEXTAREA"
            ) {
                return;
            }

            if (event.code === "Space") {
                event.preventDefault(); // Prevent page scroll
                playPause();
            } else if (event.code === "Escape" && activeState.sessionActive) {
                stop();
            }
        };

        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [activeState.sessionActive]); // Re-run effect when session state changes

    return (
        <div className={`pomodoro ${isFocusMode ? "focus-mode" : ""}`}>
            <div className="row">
                <div className="col-md-8">
                    <div className="d-flex justify-content-end mb-3">
                        <button
                            className="btn btn-outline-secondary focus-mode-btn"
                            onClick={toggleFocusMode}
                            title={
                                isFocusMode
                                    ? "Exit Focus Mode"
                                    : "Enter Focus Mode"
                            }
                        >
                            <i
                                className={`fa-solid ${
                                    isFocusMode ? "fa-compress" : "fa-expand"
                                }`}
                            ></i>
                            <span className="ms-2 d-none d-sm-inline">
                                {isFocusMode ? "Exit Focus" : "Focus Mode"}
                            </span>
                        </button>
                    </div>
                    <div className="card timer-controls-card mb-4">
                        <div className="card-header bg-primary">
                            <h2 className="h5 mb-0">Timer Controls</h2>
                        </div>
                        <div className="card-body">
                            <ChangeDuration
                                activeState={activeState}
                                setActiveState={setActiveState}
                                isTimerRunning={isTimerRunning}
                                sessionActive={activeState.sessionActive}
                            />
                            <div className="text-center mt-3">
                                <PlayPauseButtons
                                    playPause={playPause}
                                    stop={stop}
                                    activeState={activeState}
                                    isTimerRunning={isTimerRunning}
                                />
                            </div>
                        </div>
                    </div>
                    <Display
                        activeState={activeState}
                        session={session}
                        setSession={setSession}
                        isTimerRunning={isTimerRunning}
                        ProgressRing={ProgressRing}
                        onSessionComplete={handleSessionComplete}
                    />
                </div>
                <div
                    className={`col-md-4 ${
                        isFocusMode ? "d-none d-md-block" : ""
                    }`}
                >
                    <StatsDisplay stats={stats} />
                    <TaskList />
                    <SoundManager />
                </div>
            </div>
            <div
                className={`keyboard-shortcuts-info text-center mt-3 text-muted ${
                    isFocusMode ? "d-none" : ""
                }`}
            >
                <small>
                    Keyboard shortcuts: Space = Play/Pause, Esc = Stop
                </small>
            </div>
        </div>
    );
}

export default Pomodoro;
