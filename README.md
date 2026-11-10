# Hito

A tiny hitomezashi generator. Type a word across and a word down, and the stitch pattern draws itself.

Each character turns its row or column "on" or "off." Vowels, even digits, spaces, and math symbols are on. Everything else is off. The stitch flips on every other row and column.

## Modes

- **Edit** is the original view. Type straight onto the letters across the top and down the side.
- **Print** puts the same layout on a card at its true paper size. You can keep typing on the card. Pick a size (A6, 4 × 6 in, 5 × 7 in, or 5.5 × 8.5 in) and an orientation, then press **Print card**. The app sets the page size for the printer. Only the card prints.

## Run it

```sh
npm install
npm run dev
```

Build with `npm run build`. The output is a static site in `dist/`.

## Stack

Vite, React, TypeScript, and [Panda CSS](https://panda-css.com/), with [`@okshaun/components`](https://www.npmjs.com/package/@okshaun/components). The print preview uses its `PrintPreview` and `PrintPage` components.
