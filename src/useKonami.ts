import { useEffect, useState } from 'react';

const CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
].join();

/** Turns on the fancy style after ↑ ↑ ↓ ↓ ← → ← → B A, as in the first version. */
export const useKonami = () => {
  const [fancy, setFancy] = useState(false);
  useEffect(() => {
    let keys: string[] = [];
    const onKey = (event: KeyboardEvent) => {
      // Lowercase single letters, so Shift or Caps Lock still counts.
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      keys = [...keys, key].slice(-10);
      if (keys.join() === CODE) {
        setFancy(true);
        console.log('+ - - - - - - - +');
        console.log('|  K O N A M I  |');
        console.log('+ - - - - - - - +');
        keys = [];
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return fancy;
};
