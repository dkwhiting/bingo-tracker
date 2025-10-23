import { useEffect, useMemo, useState } from "react";
import { LastCalled } from "./components/LastCalled";
import { NumberInput } from "./components/NumberInput";
import { Board } from "./components/Board";
import { getLetterForNumber, LETTERS, inRange } from "./lib/bingo";

export type CalledState = {
  calledSet: Set<number>;
  history: number[]; // newest first
};

const STORAGE_KEY = "bingo-tracker-state";

function createEmptyState(): CalledState {
  return {
    calledSet: new Set<number>(),
    history: [],
  };
}

function isNumberArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "number")
  );
}

function loadInitialState(): CalledState {
  if (typeof window === "undefined") {
    return createEmptyState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyState();
    const parsed = JSON.parse(raw) as {
      calledNumbers?: unknown;
      history?: unknown;
    };
    const history = isNumberArray(parsed.history) ? [...parsed.history] : [];
    const calledNumbers = isNumberArray(parsed.calledNumbers)
      ? parsed.calledNumbers
      : [];
    const calledSet = new Set<number>(calledNumbers);
    history.forEach((num) => calledSet.add(num));
    return { calledSet, history };
  } catch {
    return createEmptyState();
  }
}

export default function App() {
  const [state, setState] = useState<CalledState>(() => loadInitialState());
  const [error, setError] = useState<string | null>(null);
  const lastThree = useMemo(() => state.history.slice(0, 3), [state.history]);
  const canUndo = state.history.length > 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = {
      calledNumbers: Array.from(state.calledSet),
      history: state.history,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [state]);

  function addNumber(rawInput: string) {
    setError(null);
    const parsed = parseUserInput(rawInput);
    if (!parsed.ok) {
      setError(parsed.error);
      return;
    }
    const n = parsed.value;
    if (!inRange(n, 1, 75)) {
      setError("Number must be between 1 and 75.");
      return;
    }

    setState((prev) => {
      if (prev.calledSet.has(n)) {
        setError(`${fmt(n)} was already called.`);
        return prev;
      }
      const nextSet = new Set(prev.calledSet);
      nextSet.add(n);
      return {
        calledSet: nextSet,
        history: [n, ...prev.history],
      };
    });
  }

  function clearAll() {
    if (confirm("Are you sure you want to clear the game history?")) {
      setState(createEmptyState());
      setError(null);
    }
  }

  function undo() {
    // Remove the newest (history[0]) from both history and calledSet.
    setError(null);
    setState((prev) => {
      if (prev.history.length === 0) return prev;
      const [last, ...rest] = prev.history;
      const nextSet = new Set(prev.calledSet);
      nextSet.delete(last);
      return { calledSet: nextSet, history: rest };
    });
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <LastCalled lastThree={lastThree} />
        </div>
        <div className="topbar-right">
          <NumberInput onSubmit={addNumber} />

          <button
            className="btn secondary"
            type="button"
            onClick={undo} // <-- fixed
            aria-label="Undo last called number"
            disabled={!canUndo}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </button>

          <button
            className="btn secondary"
            type="button"
            onClick={clearAll}
            aria-label="Clear all called numbers"
          >
            Clear Board
          </button>
        </div>
      </header>

      {error && (
        <div role="status" className="status error" aria-live="polite">
          {error}
        </div>
      )}

      <main>
        <Board calledSet={state.calledSet} addNumber={addNumber} />
      </main>
    </div>
  );
}

/**
 * Accepts inputs like:
 * - "B12", "b-12", " B 12 "
 * - "12" (letter inferred by range)
 * - "G60"
 */
function parseUserInput(
  input: string
): { ok: true; value: number } | { ok: false; error: string } {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, "");
  if (!cleaned)
    return { ok: false, error: "Enter a number (e.g., 12 or B12)." };
  const letterNum = cleaned.match(/^([BINGO])[-:]?(\d+)$/);
  if (letterNum) {
    const letter = letterNum[1] as (typeof LETTERS)[number];
    const num = Number(letterNum[2]);
    if (!inRange(num, 1, 75))
      return { ok: false, error: "Number must be 1–75." };
    const expected = getLetterForNumber(num);
    if (expected !== letter) {
      return {
        ok: false,
        error: `${letter}-${num} is out of range for ${letter}.`,
      };
    }
    return { ok: true, value: num };
  }
  const onlyNum = cleaned.match(/^\d+$/);
  if (onlyNum) {
    const n = Number(onlyNum[0]);
    if (!inRange(n, 1, 75)) return { ok: false, error: "Number must be 1–75." };
    return { ok: true, value: n };
  }
  return { ok: false, error: 'Invalid format. Try "B12" or just "12".' };
}

function fmt(n: number) {
  return `${getLetterForNumber(n)}-${n}`;
}
