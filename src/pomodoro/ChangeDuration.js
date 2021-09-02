import React from 'react'
import { minutesToDuration } from '../utils/duration'

export default function ChangeDuration({
  activeState,
  setActiveState,
  isTimerRunning,
}) {
  const addFocus = () => {
    setActiveState({
      ...activeState,
      focusDuration:
        activeState.focusDuration < 60
          ? activeState.focusDuration + 5
          : activeState.focusDuration,
    })
  }
  const minusFocus = () => {
    setActiveState({
      ...activeState,
      focusDuration:
        activeState.focusDuration > 5
          ? activeState.focusDuration - 5
          : activeState.focusDuration,
    })
  }
  function addBreak() {
    setActiveState({
      ...activeState,
      breakDuration:
        activeState.breakDuration < 15
          ? activeState.breakDuration + 1
          : activeState.breakDuration,
    })
  }
  function reduceBreak() {
    setActiveState({
      ...activeState,
      breakDuration:
        activeState.breakDuration > 1
          ? activeState.breakDuration - 1
          : activeState.breakDuration,
    })
  }
  return (
    <div className="row">
      <div className="col">
        <div className="input-group input-group-lg mb-2">
          <span className="input-group-text" data-testid="duration-focus">
            Focus Duration: {minutesToDuration(activeState.focusDuration)}
          </span>
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="decrease-focus"
              onClick={minusFocus}
              disabled={isTimerRunning}
            >
              <span className="oi oi-minus" />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="increase-focus"
              onClick={addFocus}
              disabled={isTimerRunning}
            >
              <span className="oi oi-plus" />
            </button>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="float-right">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-break">
              Break Duration: {minutesToDuration(activeState.breakDuration)}
            </span>
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-break"
                onClick={reduceBreak}
                disabled={isTimerRunning}
              >
                <span className="oi oi-minus" />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-break"
                onClick={addBreak}
                disabled={isTimerRunning}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
