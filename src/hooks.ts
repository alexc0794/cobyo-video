import { useEffect, useRef, useState } from 'react';

export function useInterval(callback: () => any, delay: number | null) {
  const savedCallback: any = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState<Array<number>>([
    window.innerWidth, window.innerHeight
  ]);

  useEffect(() => {
    function onResize() {
      setWindowDimensions([window.innerWidth, window.innerHeight]);
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return windowDimensions;
}
