// The stitch rule, ported unchanged from the first version of Hito (2024).

type CharacterType =
  | 'vowel'
  | 'consonant'
  | 'space'
  | 'even_number'
  | 'odd_number'
  | 'punctuation'
  | 'currency'
  | 'math_symbol'
  | 'unknown';

const characterType = (character: string): CharacterType => {
  if (/[aeiou]/iu.test(character)) return 'vowel';
  if (/[bcdfghjklmnpqrstvwxyz]/i.test(character)) return 'consonant';
  if (/\s/.test(character)) return 'space';
  if (/[02468]/.test(character)) return 'even_number';
  if (/[13579]/.test(character)) return 'odd_number';
  if (/[.,!?\-—;:'"(){}[\]]/.test(character)) return 'punctuation';
  if (/\$|€|£|¥|₹/.test(character)) return 'currency';
  if (/[+\-*/=<>|%]/.test(character)) return 'math_symbol';
  return 'unknown';
};

const ON_TYPES: CharacterType[] = ['vowel', 'even_number', 'space', 'math_symbol'];

/** True when a character starts its row or column with a stitch. */
export const isOn = (character: string) =>
  ON_TYPES.includes(characterType(character));

/** One cell of the grid. `top` and `left` say which edges carry a stitch. */
export type Cell = { row: number; col: number; top: boolean; left: boolean };

/**
 * Builds the grid. Columns come from the horizontal phrase and rows from the
 * vertical phrase. Each stitch flips on every other row (top edge) or every
 * other column (left edge).
 */
export const buildCells = (horizontal: string, vertical: string): Cell[] => {
  const h = Array.from(horizontal).map(isOn);
  const v = Array.from(vertical).map(isOn);
  const cells: Cell[] = [];
  v.forEach((vOn, row) => {
    h.forEach((hOn, col) => {
      cells.push({
        row,
        col,
        top: row % 2 === 0 ? hOn : !hOn,
        left: col % 2 === 0 ? vOn : !vOn,
      });
    });
  });
  return cells;
};
