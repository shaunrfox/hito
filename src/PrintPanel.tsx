import {
  type CardSizeKey,
  capacity,
  cardSizes,
  formatInches,
  largestMargin,
  MARGIN,
  type Orientation,
} from './cards';

type PrintPanelProps = {
  sizeKey: CardSizeKey;
  orientation: Orientation;
  margin: number;
  across: number;
  down: number;
  onSize: (key: CardSizeKey) => void;
  onOrientation: (orientation: Orientation) => void;
  onMargin: (margin: number) => void;
  onGuide: (show: boolean) => void;
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
  onGuide,
}: PrintPanelProps) => {
  const size = (cardSizes.find((c) => c.key === sizeKey) ?? cardSizes[0]).size;
  const cap = capacity(size, orientation, margin);
  const maxMargin = largestMargin(size, orientation, across, down);
  const tooLong = maxMargin === null;

  // When nothing fits, find the card that needs the fewest letters cut.
  const cut = cardSizes
    .flatMap((c) =>
      (['portrait', 'landscape'] as const).map((o) => {
        const fit = capacity(c.size, o, MARGIN.min);
        return {
          across: Math.max(0, across - fit.across),
          down: Math.max(0, down - fit.down),
        };
      }),
    )
    .sort((a, b) => a.across + a.down - (b.across + b.down))[0];
  const cutText = [
    cut.across > 0 && `${String(cut.across)} across`,
    cut.down > 0 && `${String(cut.down)} down`,
  ]
    .filter(Boolean)
    .join(' and ');

  return (
    <div className="print-panel" role="group" aria-label="Card settings">
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
            onMargin(maxMargin === null ? value : Math.min(value, maxMargin));
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

      <div className="panel-field panel-fit" aria-live="polite">
        {tooLong ? (
          <span className="panel-warning">
            Too long for any card. Remove {cutText}.
          </span>
        ) : (
          <>
            <span>
              <strong>{across}</strong> of {cap.across} across
            </span>
            <span>
              <strong>{down}</strong> of {cap.down} down
            </span>
          </>
        )}
      </div>
    </div>
  );
};
