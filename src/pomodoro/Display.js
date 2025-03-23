import React from "react";
import { minutesToDuration, secondsToDuration } from "../utils/duration";
import useInterval from "../utils/useInterval";
import "./Display.css";

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
    const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
    return {
        ...prevState,
        timeRemaining,
    };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
    /**
     * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
     */
    return (currentSession) => {
        if (currentSession.label === "Focusing") {
            return {
                label: "On Break",
                timeRemaining: breakDuration * 60,
            };
        }
        return {
            label: "Focusing",
            timeRemaining: focusDuration * 60,
        };
    };
}

export default function Display({
    isTimerRunning,
    activeState,
    session,
    setSession,
    ProgressRing,
    onSessionComplete,
}) {
    const { focusDuration, breakDuration, sessionActive } = activeState;
    const { label, timeRemaining } = session || {};

    const progress = session
        ? 100 *
          (1 -
              timeRemaining /
                  (label === "Focusing"
                      ? focusDuration * 60
                      : breakDuration * 60))
        : 0;

    useInterval(
        () => {
            if (session.timeRemaining === 0) {
                const currentLabel = session.label;
                onSessionComplete(currentLabel);
                setSession({
                    label:
                        currentLabel === "Focusing" ? "On Break" : "Focusing",
                    timeRemaining:
                        currentLabel === "Focusing"
                            ? breakDuration * 60
                            : focusDuration * 60,
                });
            } else {
                setSession(nextTick);
            }
        },
        isTimerRunning ? 1000 : null
    );

    if (!sessionActive || !session) {
        return null;
    }

    const isFocusing = label === "Focusing";

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col">
                    <div
                        className={`card border-${
                            isFocusing ? "primary" : "success"
                        }`}
                    >
                        <div
                            className={`card-header bg-${
                                isFocusing ? "primary" : "success"
                            } text-white text-center`}
                        >
                            <h2 className="mb-0" data-testid="session-title">
                                {label} for{" "}
                                {label === "Focusing"
                                    ? minutesToDuration(focusDuration)
                                    : minutesToDuration(breakDuration)}{" "}
                                minutes
                            </h2>
                        </div>
                        <div className="card-body text-center">
                            <ProgressRing
                                progress={progress}
                                size={240}
                                strokeWidth={15}
                                label={
                                    <div>
                                        <h3
                                            className="display-4"
                                            data-testid="session-sub-title"
                                        >
                                            {secondsToDuration(timeRemaining)}
                                        </h3>
                                        <p className="lead">remaining</p>
                                        {!isTimerRunning && (
                                            <i className="fa-solid fa-pause paused-icon"></i>
                                        )}
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
