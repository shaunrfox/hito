import { useEffect, useState } from 'react';

export type NoticeMessage = {
  text: string;
  /** Changes on every trigger, so the same text shows again. */
  id: number;
  /** Stays until the problem goes away, instead of fading out. */
  persistent?: boolean;
};

const SHOW_MS = 3000;

/** A soft note above the print panel. It fades in, then out after 3 seconds. */
export const Notice = ({ message }: { message: NoticeMessage | null }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    if (message.persistent) return;
    const timer = window.setTimeout(() => setVisible(false), SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [message]);

  return (
    <div
      className={`notice${visible ? ' visible' : ''}`}
      role="status"
      aria-live="polite"
    >
      {message?.text}
    </div>
  );
};
