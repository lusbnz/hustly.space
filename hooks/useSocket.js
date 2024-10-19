import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';

let socket;

const useSocket = (event, data = null) => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);
    }

    if (event) {
      socket.on(event, (resData) => {
        setResponse(resData);
      });
    }

    return () => {
      if (event) {
        socket.off(event);
      }
    };
  }, [event]);

  const emitEvent = useCallback((emitEventName, emitData) => {
    if (emitEventName) {
      socket.emit(emitEventName, emitData);
    }
  }, []);

  return {
    response,
    emitEvent,
  };
};

export default useSocket;
