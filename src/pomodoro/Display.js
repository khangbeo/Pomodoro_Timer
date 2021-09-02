import React from 'react'
import { minutesToDuration, secondsToDuration } from '../utils/duration'
import useInterval from '../utils/useInterval'

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1)
  return {
    ...prevState,
    timeRemaining,
  }
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
    if (currentSession.label === 'Focusing') {
      return {
        label: 'On Break',
        timeRemaining: breakDuration * 60,
      }
    }
    return {
      label: 'Focusing',
      timeRemaining: focusDuration * 60,
    }
  }
}

export default function Display({
  isTimerRunning,
  activeState,
  session,
  setSession,
}) {
  let { focusDuration,
        breakDuration,
        sessionActive, } = activeState
  let { label, timeRemaining } = session
  const progress =
    100 *
    (1 -
      timeRemaining /
        (label === 'Focusing'
          ? focusDuration * 60
          : breakDuration * 60))
  useInterval(
    () => {
      if (timeRemaining === 0) {
        new Audio('https://bigsoundbank.com/UPLOAD/mp3/1482.mp3').play()
        return setSession(
          nextSession(focusDuration, breakDuration),
        )
      }
      return setSession(nextTick)
    },
    isTimerRunning ? 1000 : null,
  )
  return (
    <div>
      {sessionActive && (
        <>
          <div className="row mb-2">
            <div className="col">
              <h2 data-testid="session-title">
                {label} for{' '}
                {label === 'Focusing'
                  ? minutesToDuration(focusDuration)
                  : minutesToDuration(breakDuration)}{' '}
                minutes
              </h2>

              <p className="lead" data-testid="session-sub-title">
                {secondsToDuration(timeRemaining)} remaining
              </p>
              {!isTimerRunning && <h2>Paused</h2>}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col">
              <div className="progress" style={{ height: '20px' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={progress} // TODO: Increase aria-valuenow as elapsed time increases
                  style={{ width: `${progress}%` }} // TODO: Increase width % as elapsed time increases
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
