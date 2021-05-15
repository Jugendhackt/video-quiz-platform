import { Server, Socket } from "socket.io";

let room = "Raum Name";
export default (io : Server, socket : Socket) => {
    socket.on('set room', (nextRoom) => {
        room = nextRoom;
        io.emit("getRoom",
            room);
    });
    socket.on('getRoom', () => socket.emit("getRoom", room));
};