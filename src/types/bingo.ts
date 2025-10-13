export type Letter = "B" | "I" | "N" | "G" | "O";

export type BingoColumn = Record<string, Letter>;

export type BingoBoardData = BingoColumn[];
