import { getLetterForNumber } from "../lib/bingo";

export function LastCalled({ lastThree }: { lastThree: number[] }) {
  return (
    <div className="last-called" aria-live="polite" aria-atomic="true">
      <span>Last called:</span>

      <ul className="chip-list" role="list">
        {lastThree.map((n, i) => (
          <li
            key={n}
            className={`chip${i === 0 ? " chip__first" : ""}`}
            aria-label={`Last called ${getLetterForNumber(n)} ${n}`}
          >
            {getLetterForNumber(n)}-{n}
          </li>
        ))}
      </ul>
    </div>
  );
}
