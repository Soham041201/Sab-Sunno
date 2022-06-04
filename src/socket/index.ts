import { io } from "socket.io-client";

const socketInit = () => {
  const options: any = {
    transports: ["websocket"],
    "force new connection": true,
    timeout: 10000,
    reconnectionAttempts: "Infinity",
  };
  return io("https://sab-sunno-backend.herokuapp.com", options);
};

export default socketInit;
