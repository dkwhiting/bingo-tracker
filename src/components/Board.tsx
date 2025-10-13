import React, { useMemo } from "react";
import { LETTERS, rangeForLetter, getLetterForNumber } from "../lib/bingo";

export function Board({ calledSet }: { calledSet: Set<number> }) {
  const columns = useMemo(() => {
    return LETTERS.map((L) => {
      const [start, end] = rangeForLetter(L);
      const nums = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      return { letter: L, nums };
    });
  }, []);

  return (
    <section className="board" aria-label="Numbers board">
      {columns.map((col) => (
        <div
          key={col.letter}
          className="col"
          role="group"
          aria-label={`Column ${col.letter}`}
        >
          <div className="col-header" aria-hidden="true">
            {col.letter}
          </div>
          <ul className="cells" role="list">
            {col.nums.map((n) => {
              const called = calledSet.has(n);
              return (
                <li
                  key={n}
                  className={`cell ${called ? "called" : ""}`}
                  aria-current={called ? "true" : undefined}
                  aria-label={`${getLetterForNumber(n)} ${n}${
                    called ? " called" : ""
                  }`}
                >
                  {n}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}
