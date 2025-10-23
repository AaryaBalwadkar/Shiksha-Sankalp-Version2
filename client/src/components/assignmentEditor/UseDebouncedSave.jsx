import { useRef, useCallback } from 'react';

export default function useDebouncedSave(fn, wait = 1000) {
  const timer = useRef(null);

  return useCallback((...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fn(...args);
    }, wait);
  }, [fn, wait]);
}