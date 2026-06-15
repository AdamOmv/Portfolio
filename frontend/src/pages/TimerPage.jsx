import { useEffect, useMemo, useRef, useState } from 'react';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sanitizeTimePart(rawValue, max) {
  const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 2);
  if (!digitsOnly) return '';
  return String(clamp(Number(digitsOnly), 0, max));
}

function toPadded(value) {
  return String(value).padStart(2, '0');
}

function parseDuration(parts) {
  const hours = clamp(Number(parts.hours) || 0, 0, 99);
  const minutes = clamp(Number(parts.minutes) || 0, 0, 59);
  const seconds = clamp(Number(parts.seconds) || 0, 0, 59);
  return (hours * 3600) + (minutes * 60) + seconds;
}

function formatTimer(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  return `${toPadded(hours)}:${toPadded(minutes)}:${toPadded(seconds)}`;
}

function playEndSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, context.currentTime);
  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.04, context.currentTime + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + 0.36);
  oscillator.onended = () => context.close();
}

function TimeInputField({
  label,
  value,
  max,
  disabled,
  onChange,
}) {
  return (
    <label className="flex w-20 flex-col items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B7280]">
      {label}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(sanitizeTimePart(event.target.value, max))}
        onBlur={(event) => {
          if (event.target.value === '') {
            onChange('00');
            return;
          }
          onChange(toPadded(clamp(Number(event.target.value), 0, max)));
        }}
        className="h-14 w-full rounded-2xl border border-[#E5E7EB] bg-white px-2 text-center text-2xl font-medium text-[#0A0A0A] outline-none transition focus:border-[#111111] disabled:cursor-not-allowed disabled:opacity-45 [color-scheme:light]"
      />
    </label>
  );
}

function ControlButton({ children, onClick, disabled, variant = 'outline' }) {
  const isPrimary = variant === 'primary';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex min-w-24 items-center justify-center rounded-full border px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 [color-scheme:light] ${
        isPrimary
          ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white hover:bg-black'
          : 'border-[#D1D5DB] bg-white text-[#0A0A0A] hover:border-[#9CA3AF]'
      }`}
    >
      {children}
    </button>
  );
}

export default function TimerPage() {
  const containerRef = useRef(null);
  const [timeParts, setTimeParts] = useState({
    hours: '00',
    minutes: '05',
    seconds: '00',
  });
  const [durationSeconds, setDurationSeconds] = useState(300);
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  const configuredSeconds = useMemo(() => parseDuration(timeParts), [timeParts]);
  const formattedTime = useMemo(() => formatTimer(remainingSeconds), [remainingSeconds]);

  useEffect(() => {
    setDurationSeconds(configuredSeconds);
    setRemainingSeconds(configuredSeconds);
    setIsFinished(false);
  }, [configuredSeconds]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const timerId = window.setInterval(() => {
      setRemainingSeconds((previous) => (previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || remainingSeconds > 0) return;
    setIsRunning(false);
    setIsFinished(true);
    playEndSound();
  }, [isRunning, remainingSeconds]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const startTimer = () => {
    if (remainingSeconds <= 0 && configuredSeconds > 0) {
      setDurationSeconds(configuredSeconds);
      setRemainingSeconds(configuredSeconds);
    }
    if ((remainingSeconds <= 0 && configuredSeconds <= 0) || (remainingSeconds <= 0 && durationSeconds <= 0)) return;
    setIsFinished(false);
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setDurationSeconds(configuredSeconds);
    setRemainingSeconds(configuredSeconds);
  };

  const restartTimer = () => {
    if (durationSeconds <= 0) return;
    setIsFinished(false);
    setRemainingSeconds(durationSeconds);
    setIsRunning(true);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
        return;
      }
      await document.exitFullscreen();
    } catch (error) {
      // Ignore fullscreen errors to keep controls responsive.
    }
  };

  const controlsDisabled = configuredSeconds <= 0 && remainingSeconds <= 0;

  const bgColor = isFinished
    ? '#16a34a'
    : isRunning && remainingSeconds <= 5 && remainingSeconds > 0
      ? '#dc2626'
      : '#FFFFFF';

  return (
    <div
      ref={containerRef}
      style={{ backgroundColor: bgColor }}
      className="flex min-h-screen items-center justify-center px-6 py-10 text-[#0A0A0A] transition-colors duration-700"
    >
      <main className={`w-full max-w-2xl transition-all duration-300 ${isFullscreen ? 'max-w-4xl' : ''}`}>
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-8 text-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <TimeInputField
              label="Heures"
              value={timeParts.hours}
              max={99}
              disabled={isRunning}
              onChange={(hours) => setTimeParts((prev) => ({ ...prev, hours }))}
            />
            <TimeInputField
              label="Minutes"
              value={timeParts.minutes}
              max={59}
              disabled={isRunning}
              onChange={(minutes) => setTimeParts((prev) => ({ ...prev, minutes }))}
            />
            <TimeInputField
              label="Secondes"
              value={timeParts.seconds}
              max={59}
              disabled={isRunning}
              onChange={(seconds) => setTimeParts((prev) => ({ ...prev, seconds }))}
            />
          </div>

          <p
            className={`select-none font-medium tabular-nums tracking-tight transition-all duration-300 ${
              isFullscreen ? 'text-7xl sm:text-8xl md:text-[9rem]' : 'text-6xl sm:text-7xl'
            }`}
          >
            {formattedTime}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <ControlButton variant="primary" onClick={startTimer} disabled={isRunning || controlsDisabled}>
              Start
            </ControlButton>
            <ControlButton onClick={pauseTimer} disabled={!isRunning}>
              Pause
            </ControlButton>
            <ControlButton onClick={resetTimer}>
              Reset
            </ControlButton>
            <ControlButton onClick={toggleFullscreen}>
              {isFullscreen ? 'Quitter plein écran' : 'Plein écran'}
            </ControlButton>
          </div>

          {isFinished && (
            <div className="space-y-3 text-center">
              <p className="text-lg font-medium">Temps écoulé</p>
              <ControlButton variant="primary" onClick={restartTimer} disabled={durationSeconds <= 0}>
                Relancer
              </ControlButton>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
