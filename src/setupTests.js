// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// Mock the fullscreen API
const mockRequestFullscreen = jest.fn(() => Promise.resolve());
const mockExitFullscreen = jest.fn(() => Promise.resolve());

Object.defineProperty(document.documentElement, "requestFullscreen", {
    writable: true,
    value: mockRequestFullscreen,
});

Object.defineProperty(document, "exitFullscreen", {
    writable: true,
    value: mockExitFullscreen,
});

Object.defineProperty(document, "fullscreenElement", {
    writable: true,
    value: null,
});

// Mock audio functionality
const mockLoad = jest.fn();
const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockSetVolume = jest.fn();

Object.defineProperty(window.HTMLMediaElement.prototype, "load", {
    writable: true,
    value: mockLoad,
});

Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
    writable: true,
    value: mockPlay,
});

Object.defineProperty(window.HTMLMediaElement.prototype, "pause", {
    writable: true,
    value: mockPause,
});

Object.defineProperty(window.HTMLMediaElement.prototype, "volume", {
    set: mockSetVolume,
});
