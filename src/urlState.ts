import { type CardSizeKey, cardSizes, MARGIN, type Orientation } from './cards';
import { type StyleKey, styles } from './styles';

export type Mode = 'edit' | 'print';

export type AppState = {
  h: string;
  v: string;
  mode: Mode;
  sizeKey: CardSizeKey;
  orientation: Orientation;
  margin: number;
  style: StyleKey;
};

export const DEFAULTS: AppState = {
  style: 'plain',
  h: 'HITOMEZASHI',
  v: 'HITOMEZASHI',
  mode: 'edit',
  sizeKey: cardSizes[0].key,
  orientation: 'portrait',
  margin: MARGIN.initial,
};

/** A word longer than this in a link is cut. It keeps a bad link from drawing a huge grid. */
const MAX_WORD = 100;

// Short names in the link: ?mode=print&size=5x7&orientation=landscape&margin=0.5&across=…&down=…
const SIZE_PARAM: Record<CardSizeKey, string> = { postcard: '4x6', card5x7: '5x7' };

const cleanWord = (value: string) =>
  Array.from(value.replace(/[\r\n]/g, '')).slice(0, MAX_WORD).join('');

/** Reads the state from the page URL. Anything missing or invalid uses the default. */
export const readState = (search = window.location.search): AppState => {
  const params = new URLSearchParams(search);
  const state = { ...DEFAULTS };

  const h = params.get('across');
  if (h !== null) state.h = cleanWord(h);
  const v = params.get('down');
  if (v !== null) state.v = cleanWord(v);

  if (params.get('mode') === 'print') state.mode = 'print';

  const size = params.get('size');
  // Only sizes on offer count. An old 4x6 link opens the default size.
  const sizeKey = cardSizes.map((c) => c.key).find(
    (key) => SIZE_PARAM[key] === size,
  );
  if (sizeKey) state.sizeKey = sizeKey;

  const orientation = params.get('orientation');
  if (orientation === 'portrait' || orientation === 'landscape') {
    state.orientation = orientation;
  }

  const style = styles.find((s) => s.key === params.get('style'));
  if (style) state.style = style.key;

  const margin = Number(params.get('margin'));
  if (params.has('margin') && Number.isFinite(margin)) {
    const snapped = Math.round(margin / MARGIN.step) * MARGIN.step;
    state.margin = Math.min(MARGIN.max, Math.max(MARGIN.min, snapped));
  }

  return state;
};

/** The query string for a state. Values that match the default are left out. */
export const toSearch = (state: AppState) => {
  const params = new URLSearchParams();
  if (state.mode !== DEFAULTS.mode) params.set('mode', state.mode);
  if (state.h !== DEFAULTS.h) params.set('across', state.h);
  if (state.v !== DEFAULTS.v) params.set('down', state.v);
  if (state.sizeKey !== DEFAULTS.sizeKey) params.set('size', SIZE_PARAM[state.sizeKey]);
  if (state.orientation !== DEFAULTS.orientation) {
    params.set('orientation', state.orientation);
  }
  if (state.margin !== DEFAULTS.margin) params.set('margin', String(state.margin));
  if (state.style !== DEFAULTS.style) params.set('style', state.style);
  const query = params.toString();
  return query ? `?${query}` : '';
};

/** Writes the state to the URL without adding a history entry. */
export const writeState = (state: AppState) => {
  const search = toSearch(state);
  if (search === window.location.search) return;
  const url = `${window.location.pathname}${search}${window.location.hash}`;
  window.history.replaceState(null, '', url);
};
