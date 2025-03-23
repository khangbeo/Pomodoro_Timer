import React from "react";
import { minutesToDuration } from "../utils/duration";

const PRESETS = [
    { name: "Classic", focus: 25, break: 5 },
    { name: "Long Focus", focus: 50, break: 10 },
    { name: "Short Focus", focus: 15, break: 3 },
];

export default function ChangeDuration({
    activeState,
    setActiveState,
    isTimerRunning,
    sessionActive,
}) {
    let { focusDuration, breakDuration } = activeState;

    const applyPreset = (preset) => {
        setActiveState({
            ...activeState,
            focusDuration: preset.focus,
            breakDuration: preset.break,
        });
    };

    const addFocus = () => {
        setActiveState({
            ...activeState,
            focusDuration:
                focusDuration < 60 ? focusDuration + 5 : focusDuration,
        });
    };

    const minusFocus = () => {
        setActiveState({
            ...activeState,
            focusDuration:
                focusDuration > 5 ? focusDuration - 5 : focusDuration,
        });
    };

    function addBreak() {
        setActiveState({
            ...activeState,
            breakDuration:
                breakDuration < 15 ? breakDuration + 1 : breakDuration,
        });
    }

    function reduceBreak() {
        setActiveState({
            ...activeState,
            breakDuration:
                breakDuration > 1 ? breakDuration - 1 : breakDuration,
        });
    }

    // Controls should be disabled if timer is running or session is active (even when paused)
    const controlsDisabled = isTimerRunning || sessionActive;

    return (
        <>
            <div className="presets-container mb-3">
                {PRESETS.map((preset) => (
                    <button
                        key={preset.name}
                        className="btn btn-outline-secondary me-2"
                        onClick={() => applyPreset(preset)}
                        disabled={controlsDisabled}
                    >
                        {preset.name}
                        <small className="d-block">
                            {preset.focus}/{preset.break}min
                        </small>
                    </button>
                ))}
            </div>
            <div className="duration-controls">
                <div className="duration-control">
                    <div className="input-group">
                        <span className="input-group-text">Focus Duration</span>
                        <div className="input-group-append">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-testid="decrease-focus"
                                onClick={minusFocus}
                                disabled={controlsDisabled}
                            >
                                <i className="fa-solid fa-minus" />
                            </button>
                            <span className="input-group-text">
                                {minutesToDuration(focusDuration)}
                            </span>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-testid="increase-focus"
                                onClick={addFocus}
                                disabled={controlsDisabled}
                            >
                                <i className="fa-solid fa-plus" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="duration-control">
                    <div className="input-group">
                        <span className="input-group-text">Break Duration</span>
                        <div className="input-group-append">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-testid="decrease-break"
                                onClick={reduceBreak}
                                disabled={controlsDisabled}
                            >
                                <i className="fa-solid fa-minus" />
                            </button>
                            <span className="input-group-text">
                                {minutesToDuration(breakDuration)}
                            </span>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-testid="increase-break"
                                onClick={addBreak}
                                disabled={controlsDisabled}
                            >
                                <i className="fa-solid fa-plus" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
