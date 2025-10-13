export const LETTERS = ["B", "I", "N", "G", "O"] as const;
export type Letter = (typeof LETTERS)[number];

export function rangeForLetter(letter: Letter): [start: number, end: number] {
  switch (letter) {
    case "B":
      return [1, 15];
    case "I":
      return [16, 30];
    case "N":
      return [31, 45];
    case "G":
      return [46, 60];
    case "O":
      return [61, 75];
  }
}

export function getLetterForNumber(n: number): Letter {
  if (n >= 1 && n <= 15) return "B";
  if (n >= 16 && n <= 30) return "I";
  if (n >= 31 && n <= 45) return "N";
  if (n >= 46 && n <= 60) return "G";
  return "O";
}

export function inRange(n: number, min: number, max: number) {
  return n >= min && n <= max;
}
