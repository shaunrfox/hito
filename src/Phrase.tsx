import { useLayoutEffect, useRef } from 'react';

type PhraseProps = {
  axis: 'h' | 'v';
  value: string;
  onChange?: (value: string) => void;
};

/**
 * One of the two words. When `onChange` is set, you type straight onto the
 * letters, as in the first version. The text is read as plain text.
 */
export const Phrase = ({ axis, value, onChange }: PhraseProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const editable = onChange !== undefined;

  // React does not own the text. Sync it only when it differs, so the caret
  // stays put while typing.
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && el.textContent !== value) el.textContent = value;
  }, [value]);

  return (
    <div
      ref={ref}
      className={`${axis}-phrase`}
      contentEditable={editable ? 'plaintext-only' : undefined}
      suppressContentEditableWarning
      spellCheck={false}
      role={editable ? 'textbox' : undefined}
      aria-label={axis === 'h' ? 'Word across' : 'Word down'}
      onInput={(event) => {
        const el = event.currentTarget;
        const text = (el.textContent ?? '').replace(/\n/g, '');
        // Leave the element truly empty so :empty shows the placeholder.
        if (text === '' && el.innerHTML !== '') el.innerHTML = '';
        onChange?.(text);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.preventDefault();
      }}
    />
  );
};
