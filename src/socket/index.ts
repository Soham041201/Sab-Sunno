import { io } from "socket.io-client";
import { uri } from "../config/config";

const socketInit = () => {
  const options: any = {
    transports: ["websocket"],
    "force new connection": true,
    timeout: 10000,
    reconnectionAttempts: "Infinity",
  };
  return io(`${uri}`, options);
};

export default socketInit;
