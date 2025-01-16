import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_URL_REAL_TIME, {
  transports: ["polling"],
});

export default socket;
