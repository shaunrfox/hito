import { type PageSize, pageSizes } from '@okshaun/components';

export type CardSizeKey = 'postcard' | 'card5x7';
export type Orientation = 'portrait' | 'landscape';

export const cardSizes: { key: CardSizeKey; label: string; size: PageSize }[] = [
  { key: 'postcard', label: '4 × 6', size: pageSizes.postcard },
  { key: 'card5x7', label: '5 × 7', size: pageSizes.card5x7 },
];

/** The card always draws the screen layout at this scale: 3/16 in cells. */
export const CARD_SCALE = 0.75;

/** Margin slider range and default, in inches. */
export const MARGIN = { min: 0.125, max: 1, step: 0.125, initial: 0.25 };

// The screen layout in CSS pixels, from index.css: 24px cells, 24px gaps,
// and a 26px track on each side of the pattern. 2px spare covers borders.
const CELL = 24;
const FRAME = 2 * 26 + 2 * 24 + 2;
const PX_PER_IN = 96;

/** Card width and height in inches, turned to the orientation. */
export const cardInches = (size: PageSize, orientation: Orientation) => {
  const long = Math.max(size.width, size.height);
  const short = Math.min(size.width, size.height);
  return orientation === 'landscape'
    ? { width: long, height: short }
    : { width: short, height: long };
};

/** How many letters fit across and down at the fixed scale. */
export const capacity = (
  size: PageSize,
  orientation: Orientation,
  margin: number,
) => {
  const { width, height } = cardInches(size, orientation);
  const fit = (inches: number) =>
    Math.max(
      0,
      Math.floor(
        ((inches - 2 * margin) * PX_PER_IN) / CARD_SCALE / CELL -
          FRAME / CELL,
      ),
    );
  return { across: fit(width), down: fit(height) };
};

/** True when both words fit the card. */
export const fits = (
  size: PageSize,
  orientation: Orientation,
  margin: number,
  across: number,
  down: number,
) => {
  const cap = capacity(size, orientation, margin);
  return across <= cap.across && down <= cap.down;
};

/** The largest slider margin that still fits both words, or null if none does. */
export const largestMargin = (
  size: PageSize,
  orientation: Orientation,
  across: number,
  down: number,
) => {
  for (let m = MARGIN.max; m >= MARGIN.min - 1e-9; m -= MARGIN.step) {
    if (fits(size, orientation, m, across, down)) return m;
  }
  return null;
};

/** Writes a margin as a fraction of an inch, such as "¼ in". */
export const formatInches = (value: number) => {
  const eighths = Math.round(value * 8);
  const whole = Math.floor(eighths / 8);
  const rest = eighths % 8;
  const fractions = ['', '⅛', '¼', '⅜', '½', '⅝', '¾', '⅞'];
  if (rest === 0) return `${String(whole)} in`;
  return `${whole > 0 ? String(whole) : ''}${fractions[rest]} in`;
};
