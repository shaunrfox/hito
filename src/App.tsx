import {
  Button,
  FormField,
  PrintPage,
  PrintPreview,
  TextInput,
  usePrintPage,
} from '@okshaun/components';
import { Box, HStack, VStack } from '@styled-system/jsx';
import { useEffect, useState } from 'react';

import { CardFace } from './CardFace';
import {
  CARD_MARGIN_IN,
  type CardSizeKey,
  cardDimensions,
  cardSizes,
} from './cards';
import { HitoPattern } from './HitoPattern';

const MAX_LENGTH = 40;
type Mode = 'edit' | 'print';

/** Pads the card face to the page margins inside the preview. */
const PreviewCard = ({ h, v }: { h: string; v: string }) => {
  const { margins } = usePrintPage();
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: `${String(margins.top)}px ${String(margins.right)}px ${String(margins.bottom)}px ${String(margins.left)}px`,
      }}
    >
      <CardFace horizontal={h} vertical={v} />
    </div>
  );
};

export const App = () => {
  const [h, setH] = useState('HITOMEZASHI');
  const [v, setV] = useState('HITOMEZASHI');
  const [mode, setMode] = useState<Mode>('edit');
  const [sizeKey, setSizeKey] = useState<CardSizeKey>('postcard');
  const [landscape, setLandscape] = useState(false);

  const card = cardSizes.find((c) => c.key === sizeKey) ?? cardSizes[0];
  const dims = cardDimensions(card.size, landscape);
  const empty = h.length === 0 || v.length === 0;

  // The printer reads the paper size from the @page rule.
  useEffect(() => {
    const style = document.createElement('style');
    style.dataset.hito = 'page';
    style.textContent = `@page { size: ${dims.width} ${dims.height}; margin: 0; }`;
    document.head.appendChild(style);
    return () => style.remove();
  }, [dims.width, dims.height]);

  return (
    <>
      <VStack className="screen-only" h="100dvh" gap="0" alignItems="stretch">
        <HStack
          as="header"
          gap="16"
          px="24"
          py="12"
          alignItems="end"
          flexWrap="wrap"
          borderBottomWidth="1"
          borderColor="border"
        >
          <FormField label="Across" labelFor="hito-h">
            <TextInput
              id="hito-h"
              name="horizontal"
              value={h}
              maxLength={MAX_LENGTH}
              autoComplete="off"
              spellCheck={false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setH(e.target.value)
              }
            />
          </FormField>
          <FormField label="Down" labelFor="hito-v">
            <TextInput
              id="hito-v"
              name="vertical"
              value={v}
              maxLength={MAX_LENGTH}
              autoComplete="off"
              spellCheck={false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setV(e.target.value)
              }
            />
          </FormField>
          <HStack gap="4" ml="auto" role="group" aria-label="Mode">
            <Button
              variant={mode === 'edit' ? 'primary' : undefined}
              aria-pressed={mode === 'edit'}
              onClick={() => setMode('edit')}
            >
              Edit
            </Button>
            <Button
              variant={mode === 'print' ? 'primary' : undefined}
              aria-pressed={mode === 'print'}
              onClick={() => setMode('print')}
            >
              Print
            </Button>
          </HStack>
        </HStack>

        {mode === 'print' && (
          <HStack
            gap="8"
            px="24"
            py="8"
            flexWrap="wrap"
            borderBottomWidth="1"
            borderColor="border"
          >
            <HStack gap="4" role="group" aria-label="Paper size">
              {cardSizes.map((option) => (
                <Button
                  key={option.key}
                  size="sm"
                  variant={sizeKey === option.key ? 'primary' : undefined}
                  aria-pressed={sizeKey === option.key}
                  onClick={() => setSizeKey(option.key)}
                >
                  {option.label}
                </Button>
              ))}
            </HStack>
            <Button size="sm" onClick={() => setLandscape((x) => !x)}>
              {landscape ? 'Landscape' : 'Portrait'}
            </Button>
            <Button
              ml="auto"
              variant="primary"
              disabled={empty}
              onClick={() => window.print()}
            >
              Print card
            </Button>
          </HStack>
        )}

        <Box flex="1" minH="0">
          {mode === 'edit' ? (
            <Box h="full" p="32">
              {empty ? (
                <Box color="fg.muted" textAlign="center" pt="64">
                  Type a word in both fields.
                </Box>
              ) : (
                <HitoPattern horizontal={h} vertical={v} showLetters />
              )}
            </Box>
          ) : (
            <PrintPreview aria-label="Card preview">
              <PrintPage
                size={card.size}
                orientation={landscape ? 'landscape' : 'portrait'}
                margins={
                  card.size.unit === 'mm' ? CARD_MARGIN_IN * 25.4 : CARD_MARGIN_IN
                }
              >
                <PreviewCard h={h} v={v} />
              </PrintPage>
            </PrintPreview>
          )}
        </Box>
      </VStack>

      {/* Only this prints. It is the card at its real size. */}
      <div
        className="print-only"
        style={{
          width: dims.width,
          height: dims.height,
          padding: `${String(CARD_MARGIN_IN)}in`,
        }}
      >
        <CardFace horizontal={h} vertical={v} />
      </div>
    </>
  );
};
