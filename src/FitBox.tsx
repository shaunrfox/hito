import { type ReactNode, useLayoutEffect, useRef, useState } from 'react';

/**
 * Centers its child and shrinks it to fit when it is too big. It never grows
 * the child, so cells keep their original size on the card.
 */
export const FitBox = ({ children }: { children: ReactNode }) => {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      // offsetWidth ignores transforms, so these are natural sizes.
      const w = i.offsetWidth;
      const h = i.offsetHeight;
      if (w === 0 || h === 0 || o.clientWidth === 0) return;
      setScale(Math.min(1, o.clientWidth / w, o.clientHeight / h));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(o);
    observer.observe(i);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={outer} className="fit-box">
      <div ref={inner} style={{ transform: `scale(${String(scale)})` }}>
        {children}
      </div>
    </div>
  );
};
