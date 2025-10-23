import React, { useRef, useState } from "react";

export function NumberInput({
  onSubmit,
}: {
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
    inputRef.current?.focus();
  }

  return (
    <form
      className="number-input"
      onSubmit={handleSubmit}
      aria-label="Enter the next called number"
    >
      <label htmlFor="nextNumber" className="sr-only">
        Next number
      </label>

      <input
        ref={inputRef}
        id="nextNumber"
        name="nextNumber"
        inputMode="numeric"
        autoComplete="off"
        placeholder="e.g., 12 or B12"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-describedby="nextNumberHelp"
      />

      <button className="btn primary" type="submit">
        Add
      </button>
    </form>
  );
}
