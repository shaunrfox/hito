import { buildCells } from './pattern';

type HitoPatternProps = {
  horizontal: string;
  vertical: string;
  /** Stitch color. */
  ink?: string;
  /** Stitch width as a share of one cell. */
  weight?: number;
  /** Accessible name for the drawing. */
  title?: string;
  /** Writes each letter beside its column (top) and row (left). */
  showLetters?: boolean;
};

const LETTER_SPACE = 1.2;

/**
 * Draws the pattern as SVG, one unit per cell, so it scales to any size and
 * prints with sharp lines. The SVG fills its box and keeps its ratio.
 */
export const HitoPattern = ({
  horizontal,
  vertical,
  ink = '#3d5560',
  weight = 0.14,
  title,
  showLetters = false,
}: HitoPatternProps) => {
  const across = Array.from(horizontal);
  const down = Array.from(vertical);
  const cols = across.length;
  const rows = down.length;
  if (cols === 0 || rows === 0) return null;

  const cells = buildCells(horizontal, vertical);
  const path = cells
    .map(({ row, col, top, left }) =>
      [
        top ? `M${col} ${row}h1` : '',
        left ? `M${col} ${row}v1` : '',
      ].join(''),
    )
    .join('');

  const pad = weight;
  const lead = showLetters ? LETTER_SPACE : 0;
  const letterStyle = {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 0.6,
    fill: '#6b7f88',
  };
  return (
    <svg
      viewBox={`${-pad - lead} ${-pad - lead} ${cols + pad * 2 + lead} ${rows + pad * 2 + lead}`}
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height="100%"
      role="img"
      aria-label={title ?? `Pattern for ${horizontal} and ${vertical}`}
      style={{ display: 'block' }}
    >
      <path
        d={path}
        fill="none"
        stroke={ink}
        strokeWidth={weight}
        strokeLinecap="round"
      />
      {showLetters && (
        <g aria-hidden style={letterStyle} textAnchor="middle">
          {across.map((char, col) => (
            <text key={`a${String(col)}`} x={col + 0.5} y={-0.45}>
              {char.toUpperCase()}
            </text>
          ))}
          {down.map((char, row) => (
            <text
              key={`d${String(row)}`}
              x={-0.65}
              y={row + 0.5}
              dominantBaseline="central"
            >
              {char.toUpperCase()}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
};
