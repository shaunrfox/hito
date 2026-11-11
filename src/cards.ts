import { type PageSize, pageSizes } from '@okshaun/components';

export type CardSizeKey = 'postcard' | 'card5x7';
export type Orientation = 'portrait' | 'landscape';

export const cardSizes: { key: CardSizeKey; label: string; size: PageSize }[] = [
  { key: 'postcard', label: '4 × 6', size: pageSizes.postcard },
  { key: 'card5x7', label: '5 × 7', size: pageSizes.card5x7 },
];

/** The card draws the screen layout at this scale when it fits: 3/16 in cells. */
export const TARGET_SCALE = 0.75;

/** The pattern may shrink to this scale before letters are limited (20% less). */
export const MIN_SCALE = 0.6;

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

/** How many letters fit across and down at the smallest scale. */
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
        ((inches - 2 * margin) * PX_PER_IN) / MIN_SCALE / CELL -
          FRAME / CELL,
      ),
    );
  return { across: fit(width), down: fit(height) };
};

/**
 * The scale for the card: the target scale when the words fit, otherwise
 * just small enough to fit, but never below the smallest scale.
 */
export const fitScale = (
  size: PageSize,
  orientation: Orientation,
  margin: number,
  across: number,
  down: number,
) => {
  const { width, height } = cardInches(size, orientation);
  const room = (inches: number) => (inches - 2 * margin) * PX_PER_IN;
  const natural = (letters: number) => FRAME + CELL * letters;
  const scale = Math.min(
    TARGET_SCALE,
    room(width) / natural(across),
    room(height) / natural(down),
  );
  return Math.max(MIN_SCALE, scale);
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

/** Card styles, chosen in print mode. Framed is the Konami style from the first version. */
export type CardStyle = 'plain' | 'framed' | 'indigo' | 'red';

export const cardStyles: {
  key: CardStyle;
  label: string;
  /** Swatch colors: the field and the stitch. */
  field: string;
  stitch: string;
}[] = [
  { key: 'plain', label: 'Plain', field: '#ffffff', stitch: '#b4d4e3' },
  { key: 'framed', label: 'Framed', field: '#fffdf3', stitch: '#59717d' },
  { key: 'indigo', label: 'Indigo', field: '#22325a', stitch: '#f1e9d6' },
  { key: 'red', label: 'Red thread', field: '#f6efe0', stitch: '#b5322b' },
];
