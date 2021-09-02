import React from 'react'
import { minutesToDuration } from '../utils/duration'

export default function ChangeDuration({
  activeState,
  setActiveState,
  isTimerRunning,
}) {
  let { focusDuration, breakDuration } = activeState
  const addFocus = () => {
    setActiveState({
      ...activeState,
      focusDuration:
        focusDuration < 60
          ? focusDuration + 5
          : focusDuration,
    })
  }
  const minusFocus = () => {
    setActiveState({
      ...activeState,
      focusDuration:
        focusDuration > 5
          ? focusDuration - 5
          : focusDuration,
    })
  }
  function addBreak() {
    setActiveState({
      ...activeState,
      breakDuration:
        breakDuration < 15
          ? breakDuration + 1
          : breakDuration,
    })
  }
  function reduceBreak() {
    setActiveState({
      ...activeState,
      breakDuration:
        breakDuration > 1
          ? breakDuration - 1
          : breakDuration,
    })
  }
  return (
    <div className="row">
      <div className="col">
        <div className="input-group input-group-lg mb-2">
          <span className="input-group-text" data-testid="duration-focus">
            Focus Duration: {minutesToDuration(focusDuration)}
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
              Break Duration: {minutesToDuration(breakDuration)}
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
