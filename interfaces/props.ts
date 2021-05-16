import { User } from "interfaces";
import { Socket } from "socket.io-client";

export interface SocketProps {
  socket: Socket;
  user: User | undefined;
}
