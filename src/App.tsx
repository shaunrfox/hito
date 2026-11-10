import { PrintPage, PrintPreview } from '@okshaun/components';
import { useEffect, useState } from 'react';

import {
  CARD_MARGIN_IN,
  type CardSizeKey,
  cardDimensions,
  cardSizes,
} from './cards';
import { Composition } from './Composition';
import { FitBox } from './FitBox';
import { useKonami } from './useKonami';

type Mode = 'edit' | 'print';

export const App = () => {
  const [h, setH] = useState('HITOMEZASHI');
  const [v, setV] = useState('HITOMEZASHI');
  const [mode, setMode] = useState<Mode>('edit');
  const [sizeKey, setSizeKey] = useState<CardSizeKey>('postcard');
  const [landscape, setLandscape] = useState(false);
  const fancy = useKonami();

  const card = cardSizes.find((c) => c.key === sizeKey) ?? cardSizes[0];
  const dims = cardDimensions(card.size, landscape);
  const margin =
    card.size.unit === 'mm' ? CARD_MARGIN_IN * 25.4 : CARD_MARGIN_IN;

  // The printer reads the paper size from the @page rule.
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `@page { size: ${dims.width} ${dims.height}; margin: 0; }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, [dims.width, dims.height]);

  return (
    <>
      <div className="page-container screen-only">
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
          <PrintPreview
            aria-label="Card preview"
            className="paper-preview"
          >
            <PrintPage
              size={card.size}
              orientation={landscape ? 'landscape' : 'portrait'}
              margins={margin}
              className="paper"
            >
              <div
                className="card"
                style={{ padding: `${String(CARD_MARGIN_IN)}in` }}
              >
                <FitBox>
                  <Composition
                    variant="composition"
                    h={h}
                    v={v}
                    onH={setH}
                    onV={setV}
                    fancy={fancy}
                  />
                </FitBox>
              </div>
            </PrintPage>
          </PrintPreview>
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
              <div className="button-group" role="group" aria-label="Paper size">
                {cardSizes.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    className={`button${sizeKey === option.key ? ' selected' : ''}`}
                    aria-pressed={sizeKey === option.key}
                    onClick={() => setSizeKey(option.key)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="button"
                onClick={() => setLandscape((x) => !x)}
              >
                {landscape ? 'Landscape' : 'Portrait'}
              </button>
              <button
                type="button"
                className="button action"
                disabled={h.length === 0 || v.length === 0}
                onClick={() => window.print()}
              >
                Print card
              </button>
              <button
                type="button"
                className="button outline"
                onClick={() => setMode('edit')}
              >
                Done
              </button>
            </>
          )}
        </header>
      </div>

      {/* Only this prints: the card at its real size. Laid out off screen. */}
      <div
        className="print-only card"
        aria-hidden
        style={{
          width: dims.width,
          height: dims.height,
          padding: `${String(CARD_MARGIN_IN)}in`,
        }}
      >
        <FitBox>
          <Composition variant="composition" h={h} v={v} fancy={fancy} />
        </FitBox>
      </div>
    </>
  );
};
