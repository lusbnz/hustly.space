import { useEffect, useRef, useCallback, useState } from "react";
import io from "socket.io-client";

let socket;

const useSocket = (event, data = null) => {
  const socketRef = useRef();
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
        transports: ["websocket"],
        withCredentials: true,
      });
      socketRef.current = socket;
    }

    if (event) {
      socketRef.current.on(event, (resData) => {
        setResponse(resData);
      });
    }

    return () => {
      if (event) {
        socketRef.current.off(event);
      }
    };
  }, [event]);

  const emitEvent = useCallback((emitEventName, emitData) => {
    if (emitEventName) {
      socketRef.current.emit(emitEventName, emitData, (ackData) => {
        if (ackData && ackData.error) {
          setError(ackData.error);
        }
      });
    }
  }, []);

  return {
    response,
    error,
    emitEvent,
  };
};

export default useSocket;
