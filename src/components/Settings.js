import React, { useState } from "react";
import "./Settings.css";

export default function Settings({ onClose }) {
    const [settings, setSettings] = useState(() => {
        const defaultSettings = {
            defaultDurations: {
                focus: 25,
                break: 5,
            },
            notifications: {
                sound: true,
                browser: false,
            },
            soundVolume: 50,
        };

        const savedSettings = localStorage.getItem("pomodoro-settings");
        if (!savedSettings) return defaultSettings;

        const parsedSettings = JSON.parse(savedSettings);
        return {
            ...defaultSettings,
            ...parsedSettings,
        };
    });

    const handleDurationChange = (durationType, value) => {
        const numValue = parseInt(value, 10);
        if (numValue > 0 && numValue <= 60) {
            setSettings((prev) => ({
                ...prev,
                defaultDurations: {
                    ...prev.defaultDurations,
                    [durationType]: numValue,
                },
            }));
        }
    };

    const handleNotificationChange = (notifType) => {
        setSettings((prev) => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [notifType]: !prev.notifications[notifType],
            },
        }));
    };

    return (
        <div className="settings-overlay">
            <div className="settings-modal">
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button
                        className="btn-close-custom"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="settings-content">
                    <section className="settings-section">
                        <h3>Default Durations</h3>
                        <div className="duration-settings">
                            <div className="duration-option">
                                <label>Focus Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={settings.defaultDurations.focus}
                                    onChange={(e) =>
                                        handleDurationChange(
                                            "focus",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <div className="duration-option">
                                <label>Break Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="60"
                                    value={settings.defaultDurations.break}
                                    onChange={(e) =>
                                        handleDurationChange(
                                            "break",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    <section className="settings-section">
                        <h3>Notifications</h3>
                        <div className="notification-settings">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="soundNotif"
                                    checked={settings.notifications.sound}
                                    onChange={() =>
                                        handleNotificationChange("sound")
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="soundNotif"
                                >
                                    Sound on Session Change
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="browserNotif"
                                    checked={settings.notifications.browser}
                                    onChange={() =>
                                        handleNotificationChange("browser")
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="browserNotif"
                                >
                                    Browser Notifications
                                </label>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
