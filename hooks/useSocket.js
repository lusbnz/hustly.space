import { useEffect, useRef, useState } from "react";

const useSocket = (url, token) => {
  const socketRef = useRef(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    if (url && !url.includes("undefined") && !url.includes("null")) {
      socketRef.current = new WebSocket(`${url}?token=${token}`);

      socketRef.current.onmessage = (event) => {
        setResponse(JSON.parse(event.data));
      };

      return () => {
        socketRef.current.close();
      };
    }
  }, [url, token]);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageStr = JSON.stringify(message);
      socketRef.current.send(messageStr);
    }
  };

  return {
    response,
    sendMessage,
  };
};

export default useSocket;
