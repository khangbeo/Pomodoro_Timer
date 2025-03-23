import React from "react";
import Pomodoro from "../pomodoro/Pomodoro";
import {
    act,
    render,
    screen,
    fireEvent,
    waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Pomodoro Timer", () => {
    let localStorageMock;

    beforeEach(() => {
        // Playing audio is not supported in jsdom
        window.HTMLMediaElement.prototype.load = jest.fn();
        window.HTMLMediaElement.prototype.play = jest.fn();
        window.HTMLMediaElement.prototype.pause = jest.fn();
        Object.defineProperty(window.HTMLMediaElement.prototype, "volume", {
            set: jest.fn(),
        });
        jest.useFakeTimers();

        // Mock localStorage
        localStorageMock = {
            getItem: jest.fn(() => null),
            setItem: jest.fn(),
            clear: jest.fn(),
        };
        Object.defineProperty(window, "localStorage", {
            value: localStorageMock,
        });

        // Mock fullscreen API with Promises
        document.documentElement.requestFullscreen = jest.fn(() =>
            Promise.resolve()
        );
        document.exitFullscreen = jest.fn(() => Promise.resolve());
        document.fullscreenElement = null;
    });

    describe("Timer Controls", () => {
        test("play button changes to pause button when clicked", () => {
            render(<Pomodoro />);
            const playPauseButton = screen.getByTestId("play-pause");

            expect(playPauseButton.querySelector("i")).toHaveClass("fa-play");
            userEvent.click(playPauseButton);
            expect(playPauseButton.querySelector("i")).toHaveClass("fa-pause");
        });

        test("stop button is disabled by default", () => {
            render(<Pomodoro />);
            const stopButton = screen.getByTestId("stop");
            expect(stopButton).toBeDisabled();
        });

        test("stop button becomes enabled when timer starts", () => {
            render(<Pomodoro />);
            const playPauseButton = screen.getByTestId("play-pause");
            const stopButton = screen.getByTestId("stop");

            userEvent.click(playPauseButton);
            expect(stopButton).toBeEnabled();
        });
    });

    describe("Focus Duration Controls", () => {
        test("displays 25:00 by default", () => {
            render(<Pomodoro />);
            expect(screen.getByText(/25:00/)).toBeInTheDocument();
        });

        test("can increase focus duration", () => {
            render(<Pomodoro />);
            const increaseButton = screen.getByTestId("increase-focus");
            userEvent.click(increaseButton);
            expect(screen.getByText(/30:00/)).toBeInTheDocument();
        });

        test("can decrease focus duration", () => {
            render(<Pomodoro />);
            const decreaseButton = screen.getByTestId("decrease-focus");
            userEvent.click(decreaseButton);
            expect(screen.getByText(/20:00/)).toBeInTheDocument();
        });

        test("cannot increase focus duration above 60 minutes", () => {
            render(<Pomodoro />);
            const increaseButton = screen.getByTestId("increase-focus");

            // Click 8 times to try to go above 60 minutes (25 + 8*5 = 65)
            for (let i = 0; i < 8; i++) {
                userEvent.click(increaseButton);
            }

            expect(screen.getByText(/60:00/)).toBeInTheDocument();
        });

        test("cannot decrease focus duration below 5 minutes", () => {
            render(<Pomodoro />);
            const decreaseButton = screen.getByTestId("decrease-focus");

            // Click 8 times to try to go below 5 minutes (25 - 8*5 = -15)
            for (let i = 0; i < 8; i++) {
                userEvent.click(decreaseButton);
            }

            expect(screen.getByText(/05:00/)).toBeInTheDocument();
        });
    });

    describe("Break Duration Controls", () => {
        test("displays 5:00 by default", () => {
            render(<Pomodoro />);
            expect(screen.getByText(/Break Duration/)).toBeInTheDocument();
            expect(screen.getByText(/5:00/)).toBeInTheDocument();
        });

        test("can increase break duration", () => {
            render(<Pomodoro />);
            const increaseButton = screen.getByTestId("increase-break");
            userEvent.click(increaseButton);
            expect(screen.getByText(/6:00/)).toBeInTheDocument();
        });

        test("can decrease break duration", () => {
            render(<Pomodoro />);
            const decreaseButton = screen.getByTestId("decrease-break");
            userEvent.click(decreaseButton);
            expect(screen.getByText(/4:00/)).toBeInTheDocument();
        });

        test("cannot increase break duration above 15 minutes", () => {
            render(<Pomodoro />);
            const increaseButton = screen.getByTestId("increase-break");

            // Click 15 times to try to go above 15 minutes
            for (let i = 0; i < 15; i++) {
                userEvent.click(increaseButton);
            }

            expect(screen.getByText(/15:00/)).toBeInTheDocument();
        });

        test("cannot decrease break duration below 1 minute", () => {
            render(<Pomodoro />);
            const decreaseButton = screen.getByTestId("decrease-break");

            // Click 10 times to try to go below 1 minute
            for (let i = 0; i < 10; i++) {
                userEvent.click(decreaseButton);
            }

            expect(screen.getByText(/1:00/)).toBeInTheDocument();
        });
    });

    describe("Focus Mode", () => {
        test("enters focus mode when button is clicked", async () => {
            render(<Pomodoro />);
            const focusModeButton = screen.getByTitle(/Enter Focus Mode/);

            await act(async () => {
                userEvent.click(focusModeButton);
            });

            expect(
                document.documentElement.requestFullscreen
            ).toHaveBeenCalled();
            expect(screen.getByTitle(/Exit Focus Mode/)).toBeInTheDocument();
        });

        test("exits focus mode when button is clicked again", async () => {
            render(<Pomodoro />);
            const focusModeButton = screen.getByTitle(/Enter Focus Mode/);

            await act(async () => {
                userEvent.click(focusModeButton);
                document.fullscreenElement = document.documentElement;
                userEvent.click(screen.getByTitle(/Exit Focus Mode/));
            });

            expect(document.exitFullscreen).toHaveBeenCalled();
            expect(screen.getByTitle(/Enter Focus Mode/)).toBeInTheDocument();
        });
    });

    describe("Task List", () => {
        test("can add a new task", async () => {
            render(<Pomodoro />);
            const input = screen.getByPlaceholderText(/Add a new task/i);
            const form = input.closest("form");

            await act(async () => {
                userEvent.type(input, "Test Task");
                fireEvent.submit(form);
            });

            const taskElement = await screen.findByText("Test Task");
            expect(taskElement).toBeInTheDocument();
        });

        test("can mark a task as complete", async () => {
            render(<Pomodoro />);
            const input = screen.getByPlaceholderText(/Add a new task/i);
            const form = input.closest("form");

            await act(async () => {
                userEvent.type(input, "Test Task");
                fireEvent.submit(form);
            });

            const taskElement = await screen.findByText("Test Task");
            const checkbox = await screen.findByRole("checkbox");

            await act(async () => {
                userEvent.click(checkbox);
            });

            expect(checkbox).toBeChecked();
            expect(taskElement.closest(".task-item")).toHaveClass("completed");
        });

        test("can delete a task", async () => {
            render(<Pomodoro />);
            const input = screen.getByPlaceholderText(/Add a new task/i);
            const form = input.closest("form");

            await act(async () => {
                userEvent.type(input, "Test Task");
                fireEvent.submit(form);
            });

            const taskElement = await screen.findByText("Test Task");
            const deleteButton = taskElement
                .closest(".task-item")
                .querySelector('[aria-label="Delete task"]');

            await act(async () => {
                userEvent.click(deleteButton);
            });

            await waitFor(() => {
                expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
            });
        });

        test("shows empty state when no tasks exist", () => {
            render(<Pomodoro />);
            expect(
                screen.getByText(/No tasks yet.*Add one to get started!/i)
            ).toBeInTheDocument();
        });

        test("persists tasks in localStorage", async () => {
            render(<Pomodoro />);
            const input = screen.getByPlaceholderText(/Add a new task/i);
            const form = input.closest("form");

            await act(async () => {
                userEvent.type(input, "Test Task");
                fireEvent.submit(form);
            });

            // Wait for the task to appear in the DOM
            await screen.findByText("Test Task");

            // Wait for localStorage to be updated
            await waitFor(
                () => {
                    const savedTasks = JSON.parse(
                        localStorageMock.setItem.mock.calls[
                            localStorageMock.setItem.mock.calls.length - 1
                        ][1]
                    );
                    expect(savedTasks).toEqual(
                        expect.arrayContaining([
                            expect.objectContaining({
                                name: "Test Task",
                                completed: false,
                            }),
                        ])
                    );
                },
                { timeout: 2000 }
            );
        });
    });

    describe("Sound Settings", () => {
        test("can toggle sound on/off", () => {
            render(<Pomodoro />);
            const soundToggle = screen.getByRole("checkbox", {
                name: /Enable Sounds/i,
            });

            expect(soundToggle).toBeChecked();
            userEvent.click(soundToggle);
            expect(soundToggle).not.toBeChecked();
        });

        test("can adjust volume", () => {
            render(<Pomodoro />);
            const volumeSlider = screen.getByRole("slider", {
                name: /Volume/i,
            });

            expect(volumeSlider).toHaveValue("50");
            fireEvent.change(volumeSlider, { target: { value: "75" } });
            expect(volumeSlider).toHaveValue("75");
        });

        test("volume control is disabled when sound is off", () => {
            render(<Pomodoro />);
            const soundToggle = screen.getByRole("checkbox", {
                name: /Enable Sounds/i,
            });
            const volumeSlider = screen.getByRole("slider", {
                name: /Volume/i,
            });

            userEvent.click(soundToggle);
            expect(volumeSlider).toBeDisabled();
        });

        test("can play and pause ambient sounds", () => {
            render(<Pomodoro />);
            const rainButton = screen.getByRole("button", {
                name: /Rain/i,
            });

            userEvent.click(rainButton);
            expect(rainButton).toHaveClass("btn-sound");
            expect(rainButton).toHaveClass("active");

            userEvent.click(rainButton);
            expect(rainButton).toHaveClass("btn-sound");
            expect(rainButton).not.toHaveClass("active");
        });
    });

    describe("Keyboard Shortcuts", () => {
        test("spacebar toggles play/pause", () => {
            render(<Pomodoro />);
            const playPauseButton = screen.getByTestId("play-pause");

            // Simulate spacebar press
            fireEvent.keyDown(document.body, {
                key: " ",
                code: "Space",
                bubbles: true,
            });

            expect(playPauseButton.querySelector("i")).toHaveClass("fa-pause");

            // Press again
            fireEvent.keyDown(document.body, {
                key: " ",
                code: "Space",
                bubbles: true,
            });
            expect(playPauseButton.querySelector("i")).toHaveClass("fa-play");
        });

        test("spacebar does not toggle when input is focused", () => {
            render(<Pomodoro />);
            const input = screen.getByPlaceholderText(/Add a new task/i);
            const playPauseButton = screen.getByTestId("play-pause");

            // Focus the input
            input.focus();

            // Simulate spacebar press while input is focused
            fireEvent.keyDown(input, {
                key: " ",
                code: "Space",
                bubbles: true,
            });

            // Should not change to pause
            expect(playPauseButton.querySelector("i")).toHaveClass("fa-play");
        });

        test("escape key stops the timer", () => {
            render(<Pomodoro />);
            const playPauseButton = screen.getByTestId("play-pause");
            const stopButton = screen.getByTestId("stop");

            // Start the timer
            userEvent.click(playPauseButton);

            // Simulate escape press
            fireEvent.keyDown(document.body, {
                key: "Escape",
                code: "Escape",
                bubbles: true,
            });

            expect(playPauseButton.querySelector("i")).toHaveClass("fa-play");
            expect(stopButton).toBeDisabled();
        });

        test("escape key does nothing when timer is not active", () => {
            render(<Pomodoro />);
            const stopButton = screen.getByTestId("stop");

            // Simulate escape press
            fireEvent.keyDown(document.body, {
                key: "Escape",
                code: "Escape",
                bubbles: true,
            });

            expect(stopButton).toBeDisabled();
        });
    });
});
