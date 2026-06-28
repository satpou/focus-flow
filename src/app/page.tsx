"use client";

import React, { useState, useEffect } from 'react';

const FocusFlowPage = () => {
  // Timer state
  const [timerMode, setTimerMode] = useState('focus'); // 'focus', 'break', 'long_break'
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // Settings state
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] = useState(4);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('focusflow-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFocusTime(settings.focusTime);
      setBreakTime(settings.breakTime);
      setLongBreakTime(settings.longBreakTime);
      setPomodorosUntilLongBreak(settings.pomodorosUntilLongBreak);
      // Set initial timer based on loaded settings
      setTimerMode('focus');
      setMinutes(settings.focusTime);
      setSeconds(0);
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval = null;

    if (isActive && minutes >= 0) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished
            clearInterval(interval);
            setIsActive(false);
            handleTimerEnd();
          } else {
            setMinutes(prevMinutes => prevMinutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(prevSeconds => prevSeconds - 1);
        }
      }, 1000);
    } else if (!isActive && minutes === 0 && seconds === 0) {
      // Handle timer finished state completion if needed
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount or isActive change
  }, [isActive, minutes, seconds]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const handleStartStop = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimerMode('focus');
    setMinutes(focusTime);
    setSeconds(0);
  };

  const handleTimerEnd = () => {
    // Show desktop notification (using browser API)
    if (Notification.permission === 'granted') {
      new Notification(timerMode === 'focus' ? 'Focus Done!' : 'Break Over!', {
        body: timerMode === 'focus' ? 'Time for a break!' : 'Ready to focus?',
      });
    }

    // Update timer mode and time
    if (timerMode === 'focus') {
      setPomodoroCount(prevCount => prevCount + 1);
      if ((pomodoroCount + 1) % pomodorosUntilLongBreak === 0) {
        setTimerMode('long_break');
        setMinutes(longBreakTime);
      } else {
        setTimerMode('break');
        setMinutes(breakTime);
      }
    } else {
      setTimerMode('focus');
      setMinutes(focusTime);
    }
    setSeconds(0);
    setIsActive(false); // Stop timer after completing a cycle
  };

  const handleSettingsChange = (newSettings) => {
    localStorage.setItem('focusflow-settings', JSON.stringify(newSettings));
    setFocusTime(newSettings.focusTime);
    setBreakTime(newSettings.breakTime);
    setLongBreakTime(newSettings.longBreakTime);
    setPomodorosUntilLongBreak(newSettings.pomodorosUntilLongBreak);
    // Reset timer to new settings if not active
    if (!isActive) {
      handleReset();
    }
  };

  // Placeholder for Stats and Progress Ring
  const stats = { today: { sessions: pomodoroCount, focus: 'N/A' } }; // Replace with actual stats logic
  const progress = (minutes * 60 + seconds) / (focusTime * 60) || 0; // Example progress, needs refinement

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">FocusFlow</h1>
      <p className="text-lg mb-8">{timerMode === 'focus' ? 'Focus' : timerMode === 'break' ? 'Break' : 'Long Break'}</p>

      <div className="text-7xl font-bold mb-4">
        {formatTime(minutes)}:{formatTime(seconds)}
      </div>

      {/* Progress Ring Placeholder */}
      <div className="relative w-48 h-48 mb-8">
        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="45"
            fill="none" stroke="#0070f3" strokeWidth="8"
            strokeDasharray="283" /* Circumference of 2*pi*45 */
            strokeDashoffset={283 * (1 - progress)}
            transform="rotate(-90 50 50)"
            className="transition-all duration-1000 ease-linear"
          />
          <text x="50" y="55" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">
            {minutes}:{formatTime(seconds)}
          </text>
        </svg>
      </div>

      <div className="flex space-x-4 mb-8">
        <button onClick={handleStartStop} className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700">
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={handleReset} className="bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700">
          Reset
        </button>
      </div>

      {/* Settings and Stats Buttons */}
      <div className="flex space-x-4 mb-8">
        <button onClick={() => alert('Settings clicked!')} className="bg-gray-700 text-white px-4 py-2 rounded-lg">
          Settings
        </button>
        <button onClick={() => alert('Stats clicked!')} className="bg-gray-700 text-white px-4 py-2 rounded-lg">
          Stats
        </button>
      </div>

      {/* To-Do List Placeholder */}
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-2">To-Do List</h2>
        {/* Placeholder for task list */}
        <div className="bg-dark-light p-4 rounded-lg">
          <p className="text-gray-400">To-do list functionality to be implemented.</p>
        </div>
      </div>

      {/* Streak Display */}
      <div className="mt-8 text-lg">
        🔥 Streak: {stats.today.sessions} days
      </div>
    </div>
  );
};

export default FocusFlowPage;
