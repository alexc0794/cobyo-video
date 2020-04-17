import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { BASE_WS_URL } from 'config';

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

export function useWebSocket(channelId: string, userId: string) {
  const [connected, setConnected] = useState<boolean>(false);
  const ws = useRef<WebSocket>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (ws.current && ws.current.readyState === 1) { return; }
    ws.current = new WebSocket(`${BASE_WS_URL}/?channelIdUserId=${channelId},${userId}`);
    function handleOpenConnection() {
      setConnected(true);
    }
    function handleReceiveMessage(event: any) {
      const body = JSON.parse(event.data);
      const { action: type, ...payload } = body;
      const reduxAction = () => ({ type, payload });
      dispatch(reduxAction());
    }
    function handleCloseConnection() {
      setConnected(false);
    }
    ws.current.onopen = handleOpenConnection;
    ws.current.onmessage = handleReceiveMessage;
    ws.current.onclose = handleCloseConnection;
  }, [channelId, userId, dispatch]);

  return {
    ws: ws.current,
    connected,
    channelId,
    userId,
  };
}
