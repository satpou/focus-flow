"use client";

import React, { useState, useEffect, useRef } from "react";

type TimerMode = "focus" | "break" | "long_break";
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

const CIRC = 2 * Math.PI * 88;

const modeLabel: Record<TimerMode, string> = {
  focus: "Waktu fokus",
  break: "Istirahat",
  long_break: "Istirahat panjang",
};

const modeColor: Record<TimerMode, string> = {
  focus: "#3b82f6",
  break: "#10b981",
  long_break: "#8b5cf6",
};

export default function FocusFlowPage() {
  const [dark, setDark] = useState(false);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [totalFocusMin, setTotalFocusMin] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoInput, setTodoInput] = useState("");
  const [settings, setSettings] = useState<Settings>({
    focusTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    pomodorosUntilLongBreak: 4,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeRef = useRef(mode);
  const settingsRef = useRef(settings);
  modeRef.current = mode;
  settingsRef.current = settings;

  const getDuration = (m: TimerMode, s: Settings) =>
    m === "focus" ? s.focusTime : m === "break" ? s.breakTime : s.longBreakTime;

  const advance = () => {
    const cur = modeRef.current;
    const s = settingsRef.current;
    if (cur === "focus") {
      setPomodoroCount((p) => {
        const next = p + 1;
        setTotalFocusMin((t) => t + s.focusTime);
        const nextMode: TimerMode =
          next % s.pomodorosUntilLongBreak === 0 ? "long_break" : "break";
        setMode(nextMode);
        setMinutes(getDuration(nextMode, s));
        setSeconds(0);
        return next;
      });
    } else {
      setMode("focus");
      setMinutes(s.focusTime);
      setSeconds(0);
    }
    setIsActive(false);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((sec) => {
          if (sec > 0) return sec - 1;
          setMinutes((min) => {
            if (min > 0) return min - 1;
            clearInterval(intervalRef.current!);
            advance();
            return 0;
          });
          return sec > 0 ? sec - 1 : 59;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive]);

  const switchMode = (m: TimerMode) => {
    setIsActive(false);
    setMode(m);
    setMinutes(getDuration(m, settings));
    setSeconds(0);
  };

  const reset = () => {
    setIsActive(false);
    setMode("focus");
    setMinutes(settings.focusTime);
    setSeconds(0);
  };

  const fmt = (n: number) => String(n).padStart(2, "0");
  const total = getDuration(mode, settings) * 60;
  const remaining = minutes * 60 + seconds;
  const progress = total > 0 ? remaining / total : 1;
  const offset = CIRC * (1 - progress);
  const accent = modeColor[mode];

  const addTodo = () => {
    if (!todoInput.trim()) return;
    setTodos((t) => [...t, { id: Date.now(), text: todoInput.trim(), done: false }]);
    setTodoInput("");
  };

  const updateSetting = (key: keyof Settings, val: number) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: val };
      if (!isActive) {
        setMinutes(getDuration(mode, next));
        setSeconds(0);
      }
      return next;
    });
  };

  // ── theme tokens ──────────────────────────────────────────────
  const t = {
    bg: dark ? "#0f0f10" : "#f5f5f7",
    surface: dark ? "#1c1c1e" : "#ffffff",
    surface2: dark ? "#2c2c2e" : "#f2f2f7",
    border: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    text: dark ? "#f5f5f5" : "#111111",
    sub: dark ? "#8e8e93" : "#6e6e73",
    muted: dark ? "#48484a" : "#d1d1d6",
    ring: dark ? "#3a3a3c" : "#e5e5ea",
  };

  const card: React.CSSProperties = {
    background: t.surface,
    border: `0.5px solid ${t.border}`,
    borderRadius: 16,
    padding: "1rem 1.25rem",
    marginBottom: 12,
  };

  const tabBase: React.CSSProperties = {
    padding: "6px 14px",
    borderRadius: 20,
    border: `0.5px solid ${t.border}`,
    fontSize: 13,
    fontWeight: 400,
    cursor: "pointer",
    color: t.sub,
    background: "transparent",
    transition: "all 0.15s",
  };

  return (
    <div style={{ background: t.bg, minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: t.text, transition: "background 0.2s, color 0.2s" }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "2rem 1rem 3rem" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500 }}>FocusFlow</div>
            <div style={{ fontSize: 13, color: t.sub, marginTop: 2 }}>{modeLabel[mode]}</div>
          </div>
          <button
            aria-label={dark ? "Aktifkan light mode" : "Aktifkan dark mode"}
            onClick={() => setDark((d) => !d)}
            style={{
              width: 44, height: 26, borderRadius: 13,
              background: dark ? accent : t.muted,
              border: "none", cursor: "pointer",
              position: "relative", transition: "background 0.2s",
            }}
          >
            <span style={{
              position: "absolute", top: 3, left: dark ? 21 : 3,
              width: 20, height: 20, borderRadius: "50%",
              background: "#fff", transition: "left 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11,
            }}>
              {dark ? "☾" : "☀"}
            </span>
          </button>
        </div>

        {/* ── Mode tabs ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1rem" }}>
          {(["focus", "break", "long_break"] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                ...tabBase,
                ...(mode === m ? {
                  background: accent + "20",
                  color: accent,
                  border: `0.5px solid ${accent}50`,
                  fontWeight: 500,
                } : {}),
              }}
            >
              {m === "focus" ? "Fokus" : m === "break" ? "Istirahat" : "Panjang"}
            </button>
          ))}
        </div>

        {/* ── Pomodoro dots ── */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: "1.25rem" }}>
          {Array.from({ length: settings.pomodorosUntilLongBreak }).map((_, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i < pomodoroCount % settings.pomodorosUntilLongBreak ? accent : t.ring,
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {/* ── Timer ring ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", position: "relative" }}>
          <svg width={220} height={220} viewBox="0 0 200 200" style={{ transform: "rotate(-90deg)" }}>
            <circle cx={100} cy={100} r={88} fill="none" stroke={t.ring} strokeWidth={7} />
            <circle
              cx={100} cy={100} r={88}
              fill="none" stroke={accent} strokeWidth={7}
              strokeDasharray={CIRC} strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
            />
          </svg>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", textAlign: "center",
          }}>
            <div style={{ fontSize: 48, fontWeight: 500, letterSpacing: -2, lineHeight: 1 }}>
              {fmt(minutes)}:{fmt(seconds)}
            </div>
            <div style={{ fontSize: 12, color: t.sub, marginTop: 4 }}>
              Sesi {pomodoroCount + 1}
            </div>
          </div>
        </div>

        {/* ── Controls ── */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: "1.5rem" }}>
          {[
            { icon: "↺", action: reset, label: "Reset" },
          ].map(({ icon, action, label }) => (
            <button key={label} aria-label={label} onClick={action} style={{
              width: 44, height: 44, borderRadius: 12,
              border: `0.5px solid ${t.border}`,
              background: t.surface, color: t.sub,
              fontSize: 18, cursor: "pointer",
            }}>{icon}</button>
          ))}
          <button onClick={() => setIsActive((a) => !a)} style={{
            padding: "0 32px", height: 44, borderRadius: 12,
            background: accent, color: "#fff",
            border: "none", fontSize: 15, fontWeight: 500,
            cursor: "pointer", transition: "background 0.2s",
          }}>
            {isActive ? "Jeda" : "Mulai"}
          </button>
          <button aria-label="Lewati sesi" onClick={advance} style={{
            width: 44, height: 44, borderRadius: 12,
            border: `0.5px solid ${t.border}`,
            background: t.surface, color: t.sub,
            fontSize: 16, cursor: "pointer",
          }}>⏭</button>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
          {[
            { label: "Sesi hari ini", value: pomodoroCount },
            { label: "Menit fokus", value: totalFocusMin },
            { label: "Streak", value: "1 🔥" },
          ].map((s) => (
            <div key={s.label} style={{ background: t.surface2, borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 500 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: t.sub, marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── To-do list ── */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Daftar tugas</span>
            <span style={{ fontSize: 12, color: t.sub }}>{todos.length} tugas</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Tambah tugas baru..."
              style={{
                flex: 1, padding: "8px 12px", borderRadius: 10,
                border: `0.5px solid ${t.border}`,
                background: t.surface2, color: t.text,
                fontSize: 14, outline: "none",
              }}
            />
            <button onClick={addTodo} style={{
              padding: "8px 14px", borderRadius: 10,
              background: accent + "20", color: accent,
              border: "none", fontSize: 18, cursor: "pointer",
            }}>+</button>
          </div>
          {todos.length === 0 ? (
            <div style={{ textAlign: "center", color: t.sub, fontSize: 13, padding: "12px 0" }}>
              Belum ada tugas.
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 0",
                borderBottom: `0.5px solid ${t.border}`,
              }}>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => setTodos((t) => t.map((x) => x.id === todo.id ? { ...x, done: !x.done } : x))}
                  style={{ width: 16, height: 16, accentColor: accent, cursor: "pointer" }}
                />
                <span style={{
                  flex: 1, fontSize: 14,
                  textDecoration: todo.done ? "line-through" : "none",
                  color: todo.done ? t.sub : t.text,
                }}>{todo.text}</span>
                <button onClick={() => setTodos((t) => t.filter((x) => x.id !== todo.id))} style={{
                  background: "none", border: "none",
                  color: t.muted, fontSize: 14, cursor: "pointer",
                }}>✕</button>
              </div>
            ))
          )}
        </div>

        {/* ── Settings ── */}
        <div style={card}>
          <button
            onClick={() => setShowSettings((v) => !v)}
            style={{
              width: "100%", display: "flex", justifyContent: "space-between",
              alignItems: "center", background: "none", border: "none",
              color: t.text, fontSize: 14, fontWeight: 500, cursor: "pointer",
              padding: 0,
            }}
          >
            <span>Pengaturan</span>
            <span style={{ color: t.sub, fontSize: 12 }}>{showSettings ? "▲" : "▼"}</span>
          </button>
          {showSettings && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
              {([
                { label: "Fokus (menit)", key: "focusTime" },
                { label: "Istirahat (menit)", key: "breakTime" },
                { label: "Istirahat panjang", key: "longBreakTime" },
                { label: "Sesi per set", key: "pomodorosUntilLongBreak" },
              ] as { label: string; key: keyof Settings }[]).map(({ label, key }) => (
                <div key={key}>
                  <div style={{ fontSize: 11, color: t.sub, marginBottom: 4 }}>{label}</div>
                  <input
                    type="number"
                    min={1}
                    value={settings[key]}
                    onChange={(e) => updateSetting(key, Number(e.target.value))}
                    style={{
                      width: "100%", padding: "7px 10px", borderRadius: 8,
                      border: `0.5px solid ${t.border}`,
                      background: t.surface2, color: t.text,
                      fontSize: 14, outline: "none",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}