# Hito

A tiny hitomezashi generator. Type a word across and a word down, and the stitch pattern draws itself.

Each character turns its row or column "on" or "off." Vowels, even digits, spaces, and math symbols are on. Everything else is off. The stitch flips on every other row and column.

## Modes

- **Edit** is the original view. Type straight onto the letters across the top and down the side.
- **Print** puts the same layout on a 4 × 6 or 5 × 7 card, portrait or landscape. You can keep typing on the card. The pattern prints at 3/16 in cells. Long words shrink it, by up to 20%. Past that, the card is full: typing stops, and a short note suggests a smaller margin or a bigger card. Press **Print card** to print. Only the card prints, at its real size.

## Run it

```sh
npm install
npm run dev
```

Build with `npm run build`. The output is a static site in `dist/`.

## Stack

Vite, React, TypeScript, and [Panda CSS](https://panda-css.com/), with [`@okshaun/components`](https://www.npmjs.com/package/@okshaun/components). The print preview uses its `PrintPreview` and `PrintPage` components.
