import React, { useState } from "react";
import "./App.css";
import Pomodoro from "./pomodoro/Pomodoro";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import Settings from "./components/Settings";

function App() {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <ThemeProvider>
            <div className="App">
                <header className="App-header">
                    <div className="header-controls">
                        <button
                            className="btn btn-secondary settings-btn"
                            onClick={() => setShowSettings(true)}
                        >
                            <i className="fa-solid fa-gear"></i>
                        </button>
                        <ThemeToggle />
                    </div>
                    <h1>Pomodoro Timer</h1>
                </header>
                <main className="App-main">
                    <Pomodoro />
                </main>
                {showSettings && (
                    <Settings onClose={() => setShowSettings(false)} />
                )}
            </div>
        </ThemeProvider>
    );
}

export default App;
