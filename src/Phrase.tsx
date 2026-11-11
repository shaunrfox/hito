import { useEffect, useLayoutEffect, useRef } from 'react';

type PhraseProps = {
  axis: 'h' | 'v';
  value: string;
  onChange?: (value: string) => void;
  /** Blocks typing past this many letters. Deleting always works. */
  maxLength?: number;
  /** Called when a keystroke is blocked by `maxLength`. */
  onLimit?: () => void;
};

/**
 * One of the two words. When `onChange` is set, you type straight onto the
 * letters, as in the first version. The text is read as plain text.
 */
export const Phrase = ({
  axis,
  value,
  onChange,
  maxLength,
  onLimit,
}: PhraseProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const editable = onChange !== undefined;

  // Block inserts that would pass the limit. Replacing a selection is allowed
  // when the result still fits.
  useEffect(() => {
    const el = ref.current;
    if (!el || maxLength === undefined) return;
    const onBeforeInput = (event: InputEvent) => {
      if (!event.inputType.startsWith('insert')) return;
      const added = Array.from(
        (event.data ?? event.dataTransfer?.getData('text/plain') ?? '').replace(
          /[\r\n]/g,
          '',
        ),
      ).length;
      const selection = window.getSelection();
      const selected =
        selection && el.contains(selection.anchorNode)
          ? Array.from(selection.toString()).length
          : 0;
      const current = Array.from(el.textContent ?? '').length;
      if (current - selected + added <= maxLength) return;
      event.preventDefault();
      // A short side-to-side nudge. Restart it on every blocked keystroke.
      el.classList.remove('nudge');
      void el.offsetWidth;
      el.classList.add('nudge');
      onLimit?.();
    };
    const onEnd = () => el.classList.remove('nudge');
    el.addEventListener('beforeinput', onBeforeInput);
    el.addEventListener('animationend', onEnd);
    return () => {
      el.removeEventListener('beforeinput', onBeforeInput);
      el.removeEventListener('animationend', onEnd);
    };
  }, [maxLength, onLimit]);

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
        const raw = el.textContent ?? '';
        const text = raw.replace(/[\r\n]/g, '');
        // Leave the element truly empty so :empty shows the placeholder.
        if (text === '' && el.innerHTML !== '') el.innerHTML = '';
        // A pasted line break: drop it here, and keep the caret at the end.
        // Otherwise the sync below rewrites the text and the caret jumps to the start.
        if (text !== '' && text !== raw) {
          el.textContent = text;
          const range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
        onChange?.(text);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.preventDefault();
      }}
    />
  );
};
