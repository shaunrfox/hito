import type { CSSProperties } from 'react';

/*
 * Card looks. A style sets the shapes: stroke weight, stitch gaps, dots,
 * corners, and frame. All styles use the original colors, set in index.css.
 * The paper always stays white.
 */

/** Optional parts a style can turn on. Each one is a `has-<part>` class. */
type Part = 'frame' | 'ground' | 'dots' | 'corners';

export type StyleKey = 'plain' | 'running' | 'seeds' | 'petals' | 'framed';

type StyleDef = { key: StyleKey; label: string; parts: Part[]; vars: Record<string, string> };

export const styles: StyleDef[] = [
  { key: 'plain', label: 'Plain', parts: [], vars: {} },
  {
    key: 'running',
    label: 'Running stitch',
    parts: [],
    vars: { '--line-width': '2.5px', '--gap': '10px' },
  },
  {
    key: 'seeds',
    label: 'Seeds',
    parts: ['dots'],
    vars: { '--line-width': '2px', '--gap': '6px', '--dot-size': '6px' },
  },
  {
    key: 'petals',
    label: 'Petals',
    parts: ['corners'],
    vars: { '--line-width': '2px', '--corner-size': '12px' },
  },
  {
    key: 'framed',
    label: 'Framed',
    parts: ['frame', 'ground', 'dots', 'corners'],
    vars: {},
  },
];

/** Class names for a style's parts. */
export const styleClasses = (key: StyleKey) =>
  (styles.find((s) => s.key === key) ?? styles[0]).parts.map((p) => `has-${p}`).join(' ');

/** CSS variables for a style, for an element's `style` prop. Colors stay the original ones. */
export const lookVars = (style: StyleKey) =>
  (styles.find((x) => x.key === style) ?? styles[0]).vars as CSSProperties;
