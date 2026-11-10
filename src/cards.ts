import { type PageSize, pageSizes } from '@okshaun/components';

export type CardSizeKey = 'a6' | 'postcard' | 'card5x7' | 'halfLetter';

export const cardSizes: { key: CardSizeKey; label: string; size: PageSize }[] = [
  { key: 'a6', label: 'A6', size: pageSizes.a6 },
  { key: 'postcard', label: '4 × 6 in', size: pageSizes.postcard },
  { key: 'card5x7', label: '5 × 7 in', size: pageSizes.card5x7 },
  { key: 'halfLetter', label: '5.5 × 8.5 in', size: pageSizes.halfLetter },
];

/** White border around the card, in inches. Most printers cannot print to the edge. */
export const CARD_MARGIN_IN = 0.25;

/** Returns width and height as CSS lengths, turned to the chosen orientation. */
export const cardDimensions = (size: PageSize, landscape: boolean) => {
  const long = Math.max(size.width, size.height);
  const short = Math.min(size.width, size.height);
  const width = landscape ? long : short;
  const height = landscape ? short : long;
  return {
    width: `${String(width)}${size.unit}`,
    height: `${String(height)}${size.unit}`,
  };
};
