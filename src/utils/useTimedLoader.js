import { useEffect, useRef, useState } from 'react';

export const useTimedLoader = (duration = 1500) => {
  const [active, setActive] = useState(false);
  const timerRef = useRef(null);
  const startedAt = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const start = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startedAt.current = Date.now();
    setActive(true);
  };

  const stop = () => {
    const elapsed = Date.now() - startedAt.current;
    const remaining = duration - elapsed;
    if (remaining > 0) {
      timerRef.current = setTimeout(() => setActive(false), remaining);
      return;
    }
    setActive(false);
  };

  return { active, start, stop };
};
