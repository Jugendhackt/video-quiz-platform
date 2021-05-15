import { Server, Socket } from "socket.io";

const ENDPOINT = "https://jhackt.hns.siasky.net";

let room = "Raum Name";
export default (io : Server, socket : Socket) => {
    socket.on('set room', (nextRoom) => {
        room = nextRoom;
        io.emit("getRoom",
            room);
    });
    socket.on('getRoom', () => socket.emit("getRoom", room));
    socket.on('getRooms', async () => {
        var data = await fetch(
            ENDPOINT + "index.json"
        );
        socket.emit("getRoom", data);
    });
};