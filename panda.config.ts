import { okshaunPreset } from '@okshaun/components/preset';
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  include: [
    './src/**/*.{ts,tsx}',
    './node_modules/@okshaun/components/dist/panda.buildinfo.json',
  ],
  exclude: [],
  presets: [okshaunPreset],
  outdir: 'src/styled-system',
  jsxFramework: 'react',
  importMap: '@styled-system',
  prefix: 'oks',
});
