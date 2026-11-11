# Hito

A tiny hitomezashi generator. Type a word across and a word down, and the stitch pattern draws itself.

Each character turns its row or column "on" or "off." Vowels, even digits, spaces, and math symbols are on. Everything else is off. The stitch flips on every other row and column.

## Modes

- Switch with the **Edit | Print** toggle at the top right.
- **Edit** is the original view. Type straight onto the letters across the top and down the side.
- **Print** puts the same layout on a 5 × 7 card (4 × 6 is turned off for now), portrait or landscape. You can keep typing on the card. The pattern prints at 3/16 in cells. Long words shrink it, by up to 20%. Past that, the card is full: typing stops, and a short note suggests a smaller margin or a bigger card. Pick a style: Plain, Running stitch, Seeds, Petals, or Framed. All use the original colors. Press **Print card** to print. Only the card prints, at its real size.

## Links

The URL keeps the current card, so a refresh opens the same thing and a link can be shared. Values that match the default are left out.

| Parameter | Values | Default |
| --- | --- | --- |
| `mode` | `print` | edit |
| `across` | the word across the top | `HITOMEZASHI` |
| `down` | the word down the side | `HITOMEZASHI` |
| `size` | `5x7` (`4x6` is off for now) | `5x7` |
| `orientation` | `portrait`, `landscape` | `portrait` |
| `margin` | inches, in steps of 0.125, from 0.125 to 1 | `0.25` |
| `style` | `plain`, `running`, `seeds`, `petals`, `framed` | `plain` |

Example: `?mode=print&across=Hello&down=World`

## Run it

```sh
npm install
npm run dev
```

Build with `npm run build`. The output is a static site in `dist/`.

## Deploy

GitHub Pages serves the `gh-pages` branch at https://shaunfox.com/hito/. The build uses the base path `/hito/`.

```sh
npm run build
git worktree add /tmp/hito-pages gh-pages
rsync -a --delete --exclude .git dist/ /tmp/hito-pages/
touch /tmp/hito-pages/.nojekyll
cd /tmp/hito-pages && git add -A && git commit -m "Deploy" && git push origin gh-pages
cd - && git worktree remove /tmp/hito-pages
```

## Stack

Vite, React, TypeScript, and [Panda CSS](https://panda-css.com/), with [`@okshaun/components`](https://www.npmjs.com/package/@okshaun/components). The print preview uses its `PrintPreview` and `PrintPage` components.
