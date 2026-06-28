"use client";

import React, { useState, useEffect, useRef } from 'react';

type TimerMode = 'focus' | 'break' | 'long_break';

interface Settings {
  focusTime: number;
  breakTime: number;
  longBreakTime: number;
  pomodorosUntilLongBreak: number;
}

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const FocusFlowPage = () => {
  const [timerMode, setTimerMode] = useState<TimerMode>('focus');
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);

  const [settings, setSettings] = useState<Settings>({
    focusTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    pomodorosUntilLongBreak: 4,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoInput, setTodoInput] = useState('');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const modeDuration = (mode: TimerMode) => {
    if (mode === 'focus') return settings.focusTime;
    if (mode === 'break') return settings.breakTime;
    return settings.longBreakTime;
  };

  const modeLabel = (mode: TimerMode) => {
    if (mode === 'focus') return 'Waktu Fokus';
    if (mode === 'break') return 'Istirahat';
    return 'Istirahat Panjang';
  };

  // Timer logic
  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSec) => {
          if (prevSec === 0) {
            setMinutes((prevMin) => {
              if (prevMin === 0) {
                clearInterval(intervalRef.current!);
                setIsActive(false);
                handleTimerEnd();
                return 0;
              }
              return prevMin - 1;
            });
            return 59;
          }
          return prevSec - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleTimerEnd = () => {
    setTimerMode((prevMode) => {
      if (prevMode === 'focus') {
        setPomodoroCount((prev) => {
          const next = prev + 1;
          setTotalFocusMinutes((m) => m + settings.focusTime);
          const isLongBreak = next % settings.pomodorosUntilLongBreak === 0;
          const nextMode: TimerMode = isLongBreak ? 'long_break' : 'break';
          setMinutes(isLongBreak ? settings.longBreakTime : settings.breakTime);
          setSeconds(0);
          return next;
        });
        return pomodoroCount % settings.pomodorosUntilLongBreak === settings.pomodorosUntilLongBreak - 1
          ? 'long_break'
          : 'break';
      } else {
        setMinutes(settings.focusTime);
        setSeconds(0);
        return 'focus';
      }
    });
  };

  const handleStartStop = () => setIsActive((prev) => !prev);

  const handleReset = () => {
    setIsActive(false);
    setTimerMode('focus');
    setMinutes(settings.focusTime);
    setSeconds(0);
  };

  const handleSkip = () => {
    setIsActive(false);
    handleTimerEnd();
  };

  const switchMode = (mode: TimerMode) => {
    setIsActive(false);
    setTimerMode(mode);
    setMinutes(modeDuration(mode));
    setSeconds(0);
  };

  const handleSettingsChange = (key: keyof Settings, value: number) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      // Update timer if not running
      if (!isActive) {
        if (timerMode === 'focus') setMinutes(key === 'focusTime' ? value : prev.focusTime);
        if (timerMode === 'break') setMinutes(key === 'breakTime' ? value : prev.breakTime);
        if (timerMode === 'long_break') setMinutes(key === 'longBreakTime' ? value : prev.longBreakTime);
        setSeconds(0);
      }
      return next;
    });
  };

  const addTodo = () => {
    if (!todoInput.trim()) return;
    setTodos((prev) => [...prev, { id: Date.now(), text: todoInput.trim(), done: false }]);
    setTodoInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const formatTime = (t: number) => String(t).padStart(2, '0');

  const total = modeDuration(timerMode) * 60;
  const remaining = minutes * 60 + seconds;
  const progress = remaining / total;
  const CIRC = 2 * Math.PI * 88;
  const offset = CIRC * (1 - progress);

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-medium">FocusFlow</h1>
        <p className="text-gray-500 mt-1">{modeLabel(timerMode)}</p>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 justify-center mb-6">
        {(['focus', 'break', 'long_break'] as TimerMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => switchMode(mode)}
            className={`px-4 py-1.5 rounded-lg text-sm border transition-colors ${
              timerMode === mode
                ? 'bg-blue-100 text-blue-700 border-blue-300 font-medium'
                : 'text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {mode === 'focus' ? 'Fokus' : mode === 'break' ? 'Istirahat' : 'Istirahat Panjang'}
          </button>
        ))}
      </div>

      {/* Pomodoro Dots */}
      <div className="flex gap-2 justify-center mb-6">
        {Array.from({ length: settings.pomodorosUntilLongBreak }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i < pomodoroCount % settings.pomodorosUntilLongBreak
                ? 'bg-blue-500'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Timer Ring */}
      <div className="flex justify-center mb-6 relative">
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="100" cy="100" r="88" fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="100" cy="100" r="88"
            fill="none" stroke="#3b82f6" strokeWidth="8"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-medium tracking-tight">
            {formatTime(minutes)}:{formatTime(seconds)}
          </span>
          <span className="text-sm text-gray-400 mt-1">Sesi {pomodoroCount + 1}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center mb-6">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
        >
          ↺
        </button>
        <button
          onClick={handleStartStop}
          className="px-8 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          {isActive ? 'Jeda' : 'Mulai'}
        </button>
        <button
          onClick={handleSkip}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"
        >
          ⏭
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Sesi hari ini', value: pomodoroCount },
          { label: 'Fokus (mnt)', value: totalFocusMinutes },
          { label: 'Streak 🔥', value: 1 },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xl font-medium">{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* To-Do List */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium">Daftar Tugas</h2>
          <span className="text-xs text-gray-400">{todos.length} tugas</span>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Tambah tugas baru..."
            className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-300"
          />
          <button
            onClick={addTodo}
            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100"
          >
            +
          </button>
        </div>
        {todos.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-3">Belum ada tugas.</p>
        ) : (
          <ul className="space-y-1">
            {todos.map((t) => (
              <li key={t.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTodo(t.id)}
                  className="w-4 h-4 accent-blue-500"
                />
                <span className={`flex-1 text-sm ${t.done ? 'line-through text-gray-300' : ''}`}>
                  {t.text}
                </span>
                <button onClick={() => deleteTodo(t.id)} className="text-gray-300 hover:text-red-400 text-sm">
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Settings */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <button
          onClick={() => setShowSettings((v) => !v)}
          className="w-full flex justify-between items-center text-sm font-medium"
        >
          <span>Pengaturan</span>
          <span className="text-gray-400">{showSettings ? '▲' : '▼'}</span>
        </button>
        {showSettings && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: 'Fokus (menit)', key: 'focusTime' as keyof Settings },
              { label: 'Istirahat (menit)', key: 'breakTime' as keyof Settings },
              { label: 'Istirahat panjang (menit)', key: 'longBreakTime' as keyof Settings },
              { label: 'Sesi per set', key: 'pomodorosUntilLongBreak' as keyof Settings },
            ].map((s) => (
              <div key={s.key}>
                <label className="text-xs text-gray-400 block mb-1">{s.label}</label>
                <input
                  type="number"
                  value={settings[s.key]}
                  min={1}
                  onChange={(e) => handleSettingsChange(s.key, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FocusFlowPage;