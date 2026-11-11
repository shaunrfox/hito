import {
  type CardSizeKey,
  cardSizes,
  formatInches,
  largestMargin,
  MARGIN,
  type Orientation,
} from './cards';
import { StitchGrid } from './StitchGrid';
import { lookVars, type StyleKey, styleClasses, styles } from './styles';

type PrintPanelProps = {
  sizeKey: CardSizeKey;
  orientation: Orientation;
  margin: number;
  across: number;
  down: number;
  onSize: (key: CardSizeKey) => void;
  onOrientation: (orientation: Orientation) => void;
  onMargin: (margin: number) => void;
  look: StyleKey;
  onLook: (look: StyleKey) => void;
  onGuide: (show: boolean) => void;
  /** Called when the margin slider hits the largest margin that fits. */
  onLimit: () => void;
};

const OrientationIcon = ({ orientation }: { orientation: Orientation }) => (
  <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
    {orientation === 'portrait' ? (
      <rect x="5.5" y="2.5" width="9" height="15" rx="1.5" />
    ) : (
      <rect x="2.5" y="5.5" width="15" height="9" rx="1.5" />
    )}
  </svg>
);

/** A real 4 × 4 corner of the pattern in a style, shrunk to fit a button. */
const StylePreview = ({ look }: { look: StyleKey }) => (
  <div className={`swatch-preview ${styleClasses(look)}`} style={lookVars(look)}>
    <div className="pattern">
      <StitchGrid horizontal="HITO" vertical="MEZA" />
    </div>
  </div>
);

/** The floating print controls: size, orientation, margin, and what fits. */
export const PrintPanel = ({
  sizeKey,
  orientation,
  margin,
  across,
  down,
  onSize,
  onOrientation,
  onMargin,
  look,
  onLook,
  onGuide,
  onLimit,
}: PrintPanelProps) => {
  const size = (cardSizes.find((c) => c.key === sizeKey) ?? cardSizes[0]).size;
  const maxMargin = largestMargin(size, orientation, across, down);

  return (
    <div className="print-panel" role="group" aria-label="Card settings">
      {/* With one size on offer there is nothing to choose, so the field hides. */}
      {cardSizes.length > 1 && (
      <div className="panel-field">
        <span className="panel-label" id="size-label">
          Size
        </span>
        <div className="button-group" role="group" aria-labelledby="size-label">
          {cardSizes.map((option) => {
            const fitsAny =
              largestMargin(option.size, orientation, across, down) !== null;
            return (
              <button
                key={option.key}
                type="button"
                className={`button${sizeKey === option.key ? ' selected' : ''}`}
                aria-pressed={sizeKey === option.key}
                disabled={!fitsAny && sizeKey !== option.key}
                onClick={() => onSize(option.key)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      )}

      <div className="panel-field">
        <span className="panel-label" id="orientation-label">
          Orientation
        </span>
        <div
          className="button-group"
          role="group"
          aria-labelledby="orientation-label"
        >
          {(['portrait', 'landscape'] as const).map((option) => {
            const fitsAny = largestMargin(size, option, across, down) !== null;
            return (
              <button
                key={option}
                type="button"
                className={`button icon${orientation === option ? ' selected' : ''}`}
                aria-pressed={orientation === option}
                aria-label={option === 'portrait' ? 'Portrait' : 'Landscape'}
                title={option === 'portrait' ? 'Portrait' : 'Landscape'}
                disabled={!fitsAny && orientation !== option}
                onClick={() => onOrientation(option)}
              >
                <OrientationIcon orientation={option} />
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel-field margin-field">
        <label className="panel-label" htmlFor="margin">
          Margin
        </label>
        <input
          id="margin"
          type="range"
          min={MARGIN.min}
          max={MARGIN.max}
          step={MARGIN.step}
          value={margin}
          onChange={(event) => {
            const value = Number(event.target.value);
            if (maxMargin !== null && value > maxMargin) {
              onMargin(maxMargin);
              onLimit();
              return;
            }
            onMargin(value);
          }}
          onPointerDown={() => onGuide(true)}
          onPointerUp={() => onGuide(false)}
          onPointerCancel={() => onGuide(false)}
          onKeyDown={() => onGuide(true)}
          onKeyUp={() => onGuide(false)}
          onBlur={() => onGuide(false)}
          aria-valuetext={formatInches(margin)}
        />
        <span className="panel-value">{formatInches(margin)}</span>
      </div>

      <div className="panel-field">
        <span className="panel-label" id="style-label">
          Style
        </span>
        <div className="button-group" role="group" aria-labelledby="style-label">
          {styles.map((option) => (
            <button
              key={option.key}
              type="button"
              className={`button swatch${look === option.key ? ' selected' : ''}`}
              aria-pressed={look === option.key}
              aria-label={option.label}
              title={option.label}
              onClick={() => onLook(option.key)}
            >
              <StylePreview look={option.key} />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
