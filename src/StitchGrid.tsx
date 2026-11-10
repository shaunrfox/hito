import { buildCells } from './pattern';

/**
 * The stitch grid, drawn the way the first version drew it: one div per cell,
 * with a top line and a left line that the CSS turns into stitches.
 */
export const StitchGrid = ({
  horizontal,
  vertical,
}: {
  horizontal: string;
  vertical: string;
}) => {
  const cols = Array.from(horizontal).length;
  const rows = Array.from(vertical).length;
  const cells = buildCells(horizontal, vertical);
  return (
    <div
      className="pattern-container"
      style={{
        width: `calc(${String(cols)} * var(--box-size))`,
        height: `calc(${String(rows)} * var(--box-size))`,
      }}
    >
      {cells.map(({ row, col, top, left }) => (
        <div
          key={`${String(row)}-${String(col)}`}
          className={['block', top && 'h-on', left && 'v-on']
            .filter(Boolean)
            .join(' ')}
        >
          {top && <div className="h-line" />}
          {left && <div className="v-line" />}
        </div>
      ))}
    </div>
  );
};
