import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { BASE_WS_URL } from '../config';

export function useWebSocket(channelId: string, userId: string) {
  const [connected, setConnected] = useState<boolean>(false);
  const ws = useRef<WebSocket>();
  const dispatch = useDispatch();

  useEffect(() => {
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
    ws,
    connected,
    channelId,
    userId,
  };
}
