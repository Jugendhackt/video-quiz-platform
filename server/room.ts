import { Room } from "interfaces";
import { Server, Socket } from "socket.io";

const ENDPOINT = "https://jhackt.hns.siasky.net";

var room: Room | null = null;
var roomUrl: string | null = null;
var detailedRoom: Record<string, any> | null = null;
var rooms: Room[] = [];
var roomUrls: string[] = [];
export default (io: Server, socket: Socket) => {
  const play = async () => {
    if (detailedRoom == null) {
      var response = await fetch(roomUrl!);
      var data = await response.json();
      detailedRoom = data;
    }
    io.emit("play", {
      videoType: detailedRoom!["videoType"],
      videoLink: detailedRoom!["videoLink"],
    });
  };
  socket.on("setRoom", async (id) => {
    room = rooms[id];
    roomUrl = roomUrls[id];
    detailedRoom = null;
    io.emit("getRoom", room);
    play();
  });
  socket.on("getRoom", () => socket.emit("getRoom", room));
  socket.on("loadRoom", play);
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

  socket.on("openQuiz", () => {
    if (detailedRoom == null) return;
    var questions = detailedRoom!["questions"];
    questions?.map((question: Record<string, any>) => {
      question["answers"] = question["answers"]?.map(
        (answer: Record<string, any>) => {
          return answer["content"];
        }
      );
    });
    io.emit("openQuiz", questions);
  });

  socket.on("validateQuiz", (questionsAnswers: Array<Array<boolean>>) => {
    if (detailedRoom == null) return;
    var validation: boolean[][] = [];
    questionsAnswers.forEach((questionAnswer, questionIndex) => {
      questionAnswer.forEach((answer, answerIndex) => {
        validation[questionIndex][answerIndex] =
          answer ==
          detailedRoom!["questions"][questionIndex]["answers"][answerIndex][
            "correct"
          ];
      });
    });
    socket.emit("validateQuiz", validation);
  });
};
