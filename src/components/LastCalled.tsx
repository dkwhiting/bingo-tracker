import React from "react";
import { getLetterForNumber } from "../lib/bingo";

export function LastCalled({ lastThree }: { lastThree: number[] }) {
  return (
    <div className="last-called" aria-live="polite" aria-atomic="true">
      <span className="section-title">Last 3:</span>
      <ul className="chip-list" role="list">
        {lastThree.map((n) => (
          <li
            key={n}
            className="chip"
            aria-label={`Last called ${getLetterForNumber(n)} ${n}`}
          >
            <span className="chip-letter">{getLetterForNumber(n)}</span>
            <span className="chip-num">{n}</span>
          </li>
        ))}
        {lastThree.length === 0 && <li className="chip muted">—</li>}
      </ul>
    </div>
  );
}
