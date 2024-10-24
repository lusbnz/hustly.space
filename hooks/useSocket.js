import { useEffect, useRef, useState } from "react";

const useSocket = (url, token) => {
  const socketRef = useRef(null);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    socketRef.current = new WebSocket(`${url}?token=${token}`);

    socketRef.current.onmessage = (event) => {
      setResponse(JSON.parse(event.data));
    };

    // return () => {
    //   socketRef.current.close();
    // };
  }, [url, token]);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return {
    response,
    sendMessage,
  };
};

export default useSocket;
