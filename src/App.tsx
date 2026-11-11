import { PrintPage, PrintPreview } from '@okshaun/components';
import { type ReactNode, useCallback, useEffect, useState } from 'react';

import {
  type CardSizeKey,
  capacity,
  cardInches,
  cardSizes,
  fitScale,
  largestMargin,
  MARGIN,
  MIN_SCALE,
  type Orientation,
} from './cards';
import { Composition } from './Composition';
import { type NoticeMessage, Notice } from './Notice';
import { PrintPanel } from './PrintPanel';
import { type Mode, readState, writeState } from './urlState';
import { useKonami } from './useKonami';

// Read once, so a refresh or a shared link opens the same card.
const initial = readState();

const ORIENTATIONS: Orientation[] = ['portrait', 'landscape'];

const FULL = 'This card is full. Try a smaller margin or a bigger card.';

/** The card face: the composition at the given scale, centered in the margins. */
const CardFace = ({
  margin,
  scale,
  children,
}: {
  margin: number;
  scale: number;
  children: ReactNode;
}) => (
  <div className="card" style={{ padding: `${String(margin)}in` }}>
    <div className="card-scale" style={{ transform: `scale(${String(scale)})` }}>
      {children}
    </div>
  </div>
);

export const App = () => {
  const [h, setH] = useState(initial.h);
  const [v, setV] = useState(initial.v);
  const [mode, setMode] = useState<Mode>(initial.mode);
  const [sizeKey, setSizeKey] = useState<CardSizeKey>(initial.sizeKey);
  const [orientation, setOrientation] = useState<Orientation>(initial.orientation);
  const [margin, setMargin] = useState(initial.margin);
  const [guide, setGuide] = useState(false);
  const [notice, setNotice] = useState<NoticeMessage | null>(null);
  const fancy = useKonami();
  const warnFull = useCallback(
    () => setNotice({ text: FULL, id: Date.now() }),
    [],
  );

  const size = (cardSizes.find((c) => c.key === sizeKey) ?? cardSizes[0]).size;
  const inches = cardInches(size, orientation);
  const across = Array.from(h).length;
  const down = Array.from(v).length;
  const cap = capacity(size, orientation, margin);
  const fitsNow = across <= cap.across && down <= cap.down;
  const scale = fitsNow
    ? fitScale(size, orientation, margin, across, down)
    : MIN_SCALE;

  // A word from edit mode that fits no card: say so until it is shortened.
  const tooLong =
    mode === 'print' &&
    !fitsNow &&
    largestMargin(size, orientation, across, down) === null;
  useEffect(() => {
    if (!tooLong) {
      setNotice((n) => (n?.persistent ? null : n));
      return;
    }
    const cut = cardSizes
      .flatMap((c) =>
        ORIENTATIONS.map((o) => {
          const fit = capacity(c.size, o, MARGIN.min);
          return {
            across: Math.max(0, across - fit.across),
            down: Math.max(0, down - fit.down),
          };
        }),
      )
      .sort((a, b) => a.across + a.down - (b.across + b.down))[0];
    const parts = [
      cut.across > 0 && `${String(cut.across)} across`,
      cut.down > 0 && `${String(cut.down)} down`,
    ].filter(Boolean);
    setNotice({
      text: `These words are too long for any card. Remove ${parts.join(' and ')}.`,
      id: 0,
      persistent: true,
    });
  }, [tooLong, across, down]);

  // Entering print mode: if the words do not fit, shrink the margin, then try
  // the other cards. Leave everything as is when nothing fits.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs on entry only
  useEffect(() => {
    if (mode !== 'print' || fitsNow) return;
    const options = [
      { key: sizeKey, o: orientation },
      ...cardSizes.flatMap((c) => ORIENTATIONS.map((o) => ({ key: c.key, o }))),
    ];
    for (const option of options) {
      const s = (cardSizes.find((c) => c.key === option.key) ?? cardSizes[0]).size;
      const m = largestMargin(s, option.o, across, down);
      if (m !== null) {
        setSizeKey(option.key);
        setOrientation(option.o);
        setMargin(Math.min(margin, m));
        return;
      }
    }
  }, [mode]);

  // A size or orientation change keeps the words: shrink the margin if needed.
  const choose = (key: CardSizeKey, o: Orientation) => {
    const s = (cardSizes.find((c) => c.key === key) ?? cardSizes[0]).size;
    const m = largestMargin(s, o, across, down);
    setSizeKey(key);
    setOrientation(o);
    if (m !== null) setMargin((current) => Math.min(current, m));
  };

  // Keep the URL in step, so a refresh keeps the card and the link can be shared.
  useEffect(() => {
    writeState({ h, v, mode, sizeKey, orientation, margin });
  }, [h, v, mode, sizeKey, orientation, margin]);

  // The printer reads the paper size from the @page rule.
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@page { size: ${String(inches.width)}in ${String(inches.height)}in; margin: 0; }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, [inches.width, inches.height]);

  const canPrint = across > 0 && down > 0 && fitsNow;

  return (
    <>
      <div className={`page-container screen-only mode-${mode}`}>
        {mode === 'edit' ? (
          <Composition
            variant="wrapper"
            h={h}
            v={v}
            onH={setH}
            onV={setV}
            fancy={fancy}
          />
        ) : (
          <>
            <PrintPreview aria-label="Card preview" className="paper-preview">
              <PrintPage
                size={size}
                orientation={orientation}
                margins={margin}
                showMargins={guide}
                className="paper"
              >
                <CardFace margin={margin} scale={scale}>
                  <Composition
                    variant="composition"
                    h={h}
                    v={v}
                    onH={setH}
                    onV={setV}
                    maxAcross={Math.max(cap.across, across)}
                    maxDown={Math.max(cap.down, down)}
                    onLimit={warnFull}
                    fancy={fancy}
                  />
                </CardFace>
              </PrintPage>
            </PrintPreview>
            <PrintPanel
              sizeKey={sizeKey}
              orientation={orientation}
              margin={margin}
              across={across}
              down={down}
              onSize={(key) => choose(key, orientation)}
              onOrientation={(o) => choose(sizeKey, o)}
              onMargin={setMargin}
              onGuide={setGuide}
              onLimit={warnFull}
            />
            <Notice message={notice} />
          </>
        )}

        <header className="main-header">
          {/* Print card sits left of the toggle, so the toggle never moves. */}
          {mode === 'print' && (
            <button
              type="button"
              className="button action"
              disabled={!canPrint}
              onClick={() => window.print()}
            >
              Print card
            </button>
          )}
          <div className="button-group" role="group" aria-label="Mode">
            {(['edit', 'print'] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={`button${mode === option ? ' selected' : ''}`}
                aria-pressed={mode === option}
                onClick={() => setMode(option)}
              >
                {option === 'edit' ? 'Edit' : 'Print'}
              </button>
            ))}
          </div>
        </header>
      </div>

      {/* Only this prints: the card at its real size. Laid out off screen. */}
      <div
        className="print-only"
        aria-hidden
        style={{ width: `${String(inches.width)}in`, height: `${String(inches.height)}in` }}
      >
        <CardFace margin={margin} scale={scale}>
          <Composition variant="composition" h={h} v={v} fancy={fancy} />
        </CardFace>
      </div>
    </>
  );
};
