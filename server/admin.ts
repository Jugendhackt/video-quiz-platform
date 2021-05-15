import { Room } from "interfaces";
import { Socket } from "socket.io";

const ENDPOINT = "https://jhackt.hns.siasky.net";

var room: Room | null = null;
var roomUrl: string | null = null;
var detailedRoom : Record<string, any> | null = null;
var rooms: Room[] = [];
var roomUrls: string[] = [];
export default (socket: Socket) => {
  socket.on("setRoom", async (id) => {
    room = rooms[id];
    roomUrl = roomUrls[id];
    detailedRoom = null;
    socket.emit("getRoom", room);
  });
  socket.on("getRoom", () => socket.emit("getRoom", room));
  socket.on("loadRoom", async () => {
    if(detailedRoom == null){
      var response = await fetch(roomUrl!);
      var data = await response.json();
      detailedRoom = data;
    }
    socket.emit("play", {
      videoType: detailedRoom!["videoType"],
      videoLink: detailedRoom!["videoLink"]
    });
  });
  socket.on("getRooms", async () => {
    if (rooms.length == 0) {
      var response = await fetch(ENDPOINT + "/index.json");
      var allSubjects: Record<string, any> = await response.json();
      var data: Record<string, any>[] = [];
      Object.keys(allSubjects).forEach((key) => {
        var courses = allSubjects[key];

        courses.forEach((room: Record<string, any>) => data.push(room));
      });
      roomUrls = data.map((current) => current["url"]);
      rooms = data as Room[];

    }
    socket.emit("getRooms", rooms);
  });
};
