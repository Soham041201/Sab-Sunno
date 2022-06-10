import { io } from "socket.io-client";

const socketInit = () => {
  const options: any = {
    transports: ["websocket"],
    "force new connection": true,
    timeout: 10000,
    reconnectionAttempts: "Infinity",
  };
  return io("http://localhost:8000", options);
};

export default socketInit;
