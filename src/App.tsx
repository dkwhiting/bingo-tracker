import { useMemo, useState } from "react";
import { LastCalled } from "./components/LastCalled";
import { NumberInput } from "./components/NumberInput";
import { Board } from "./components/Board";
import { getLetterForNumber, LETTERS, inRange } from "./lib/bingo";

export type CalledState = {
  calledSet: Set<number>;
  history: number[]; // newest first
};

const initialState: CalledState = {
  calledSet: new Set<number>(),
  history: [],
};

export default function App() {
  const [state, setState] = useState<CalledState>(initialState);
  const [error, setError] = useState<string | null>(null);

  const lastThree = useMemo(() => state.history.slice(0, 3), [state.history]);

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
        // Already called: keep state, but surface subtle info message
        setError(`${fmt(n)} was already called.`);
        return prev;
      }
      const next = new Set(prev.calledSet);
      next.add(n);
      return {
        calledSet: next,
        history: [n, ...prev.history],
      };
    });
  }

  function clearAll() {
    if (confirm("Are you sure you want to clear the game history?")) {
      setState(initialState);
      setError(null);
    }
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
            onClick={clearAll}
            aria-label="Clear all called numbers"
          >
            Clear
          </button>
        </div>
      </header>

      {error && (
        <div role="status" className="status error" aria-live="polite">
          {error}
        </div>
      )}

      <main>
        <Board calledSet={state.calledSet} />
      </main>
    </div>
  );
}

/**
 * Accepts inputs like:
 *  - "B12", "b-12", " B 12 "
 *  - "12" (letter inferred by range)
 *  - "G60"
 */
function parseUserInput(
  input: string
): { ok: true; value: number } | { ok: false; error: string } {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, "");
  if (!cleaned)
    return { ok: false, error: "Enter a number (e.g., 12 or B12)." };

  // Try patterns like B12, B-12, B:12, etc.
  const letterNum = cleaned.match(/^([BINGO])[-:]?(\d{1,2})$/);
  if (letterNum) {
    const letter = letterNum[1] as (typeof LETTERS)[number];
    const num = Number(letterNum[2]);
    if (!inRange(num, 1, 75))
      return { ok: false, error: "Number must be 1–75." };

    // Validate number fits the letter's range
    const expected = getLetterForNumber(num);
    if (expected !== letter) {
      return {
        ok: false,
        error: `${letter}-${num} is out of range for ${letter}.`,
      };
    }
    return { ok: true, value: num };
  }

  // Try plain number
  const onlyNum = cleaned.match(/^\d{1,2}$/);
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
