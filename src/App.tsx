import { PrintPage, PrintPreview } from '@okshaun/components';
import { useEffect, useState } from 'react';

import {
  CARD_SCALE,
  type CardSizeKey,
  capacity,
  cardInches,
  cardSizes,
  largestMargin,
  MARGIN,
  type Orientation,
} from './cards';
import { Composition } from './Composition';
import { PrintPanel } from './PrintPanel';
import { useKonami } from './useKonami';

type Mode = 'edit' | 'print';

const ORIENTATIONS: Orientation[] = ['portrait', 'landscape'];

/** The card face: the composition at the fixed scale, centered in the margins. */
const CardFace = ({ margin, children }: { margin: number; children: React.ReactNode }) => (
  <div className="card" style={{ padding: `${String(margin)}in` }}>
    <div className="card-scale" style={{ transform: `scale(${String(CARD_SCALE)})` }}>
      {children}
    </div>
  </div>
);

export const App = () => {
  const [h, setH] = useState('HITOMEZASHI');
  const [v, setV] = useState('HITOMEZASHI');
  const [mode, setMode] = useState<Mode>('edit');
  const [sizeKey, setSizeKey] = useState<CardSizeKey>('postcard');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [margin, setMargin] = useState(MARGIN.initial);
  const [guide, setGuide] = useState(false);
  const fancy = useKonami();

  const size = (cardSizes.find((c) => c.key === sizeKey) ?? cardSizes[0]).size;
  const inches = cardInches(size, orientation);
  const across = Array.from(h).length;
  const down = Array.from(v).length;
  const cap = capacity(size, orientation, margin);
  const fitsNow = across <= cap.across && down <= cap.down;

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
                <CardFace margin={margin}>
                  <Composition
                    variant="composition"
                    h={h}
                    v={v}
                    onH={setH}
                    onV={setV}
                    maxAcross={Math.max(cap.across, across)}
                    maxDown={Math.max(cap.down, down)}
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
            />
          </>
        )}

        <header className="main-header">
          {mode === 'edit' ? (
            <button
              type="button"
              className="button"
              onClick={() => setMode('print')}
            >
              Print
            </button>
          ) : (
            <>
              <button
                type="button"
                className="button outline"
                onClick={() => setMode('edit')}
              >
                Done
              </button>
              <button
                type="button"
                className="button action"
                disabled={!canPrint}
                onClick={() => window.print()}
              >
                Print card
              </button>
            </>
          )}
        </header>
      </div>

      {/* Only this prints: the card at its real size. Laid out off screen. */}
      <div
        className="print-only"
        aria-hidden
        style={{ width: `${String(inches.width)}in`, height: `${String(inches.height)}in` }}
      >
        <CardFace margin={margin}>
          <Composition variant="composition" h={h} v={v} fancy={fancy} />
        </CardFace>
      </div>
    </>
  );
};
