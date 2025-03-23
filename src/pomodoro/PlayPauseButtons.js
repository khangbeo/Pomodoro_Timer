import React from "react";
import classNames from "../utils/class-names";

export default function PlayPauseButtons({
    playPause,
    stop,
    activeState,
    isTimerRunning,
}) {
    let { sessionActive } = activeState;
    return (
        <div className="row">
            <div className="col">
                <div className="d-flex justify-content-center mb-4">
                    <div
                        className="btn-group btn-group-lg"
                        role="group"
                        aria-label="Timer controls"
                    >
                        <button
                            type="button"
                            className="btn btn-primary"
                            data-testid="play-pause"
                            title="Start or pause timer"
                            onClick={playPause}
                        >
                            <i
                                className={classNames({
                                    "fa-solid": true,
                                    "fa-play": !isTimerRunning,
                                    "fa-pause": isTimerRunning,
                                })}
                            />
                        </button>
                        {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-testid="stop"
                            title="Stop the session"
                            onClick={stop}
                            disabled={!sessionActive}
                        >
                            <i className="fa-solid fa-stop" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
