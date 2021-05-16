import Chat from "components/Chat";
import ChooseRoom from "components/ChooseRoom";
import Quiz from "components/Quiz";
import { Room, User } from "interfaces";
import React, { useEffect, useState } from "react";
import { Button, ButtonToolbar, Col, Container, Row } from "react-bootstrap";
import socketIOClient from "socket.io-client";

const socket = socketIOClient();

export default function LivePage() {
  const [userList, setUserList] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState<Room>();
  const [msg, setMsg] = useState("");
  const [video, setVideo] = useState<Record<string, any> | null>(null);
  const [loggedUser, setLoggedUser] = useState<User>();

  const [name, setName] = React.useState<string>("");
  const [quiz, setQuiz] = useState<any[]>();

  useEffect(() => {
      console.log("run effect!");
    var temporaryName =
      localStorage.getItem("name") ?? Math.random().toString(36).substring(7);

    setName(temporaryName);
    connect(temporaryName);
    // list of connected users
    socket.on("users", (data) => {
      console.log("Retrieved users!");
      setUserList(JSON.parse(data));
    });
    socket.on("play", (data) => setVideo(data));
    // get the logged user
    socket.on("connecteduser", (data) => {
      console.log("Connected!");
      setLoggedUser(JSON.parse(data));
      socket.emit("getRooms");
      socket.emit("getRoom");
    });
    socket.on("getRoom", (data) => setRoom(data));
    socket.emit("getRooms");
    socket.on("openQuiz", (data) => {
      console.log("Retrieved quiz!");
      console.log(data);
      setQuiz(data);
    });
    socket.on("getRooms", (data) => setRooms(data));
  }, []);

  const connect = (name: string) => {
    setName(name);
    // subscribe a new user
    socket.emit("login", name);
  };
  return (<div>
    <Quiz questions={quiz} />
    <Container fluid={true}>
      <Row className="align-self-stretch h-100">
        <Col xs="12" md="8">

            {room && (
              <div>
      {video && video["videoType"] == "youtube" &&
        <div style={{
          maxWidth: "100%",
          width: "600px",
          left: 0,
          right: 0,
          margin: "auto"
        }}><div
          style={{
            position: "relative",
            paddingBottom: "56.25%" /* 16:9 */,
            paddingTop: 25,
            height: 0
          }}
        ><iframe
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0
          }} src={"https://www.youtube-nocookie.com/embed/" + video!["videoLink"]} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}></iframe>
          </div></div>
      }
                <p>Topic: {room.topic}</p>
                <p>Subject: {room.subject}</p>
                <p>Question count: {room.questionCount?.toString()}</p>
                <Button
                  variant="outline-primary"
                  onClick={() => socket.emit("loadRoom")}
                >
                  Load
                </Button>
              </div>
            )}
          <br />
          <ChooseRoom socket={socket} user={loggedUser} rooms={rooms} />
          <ButtonToolbar
            className="justify-content-between"
            aria-label="Toolbar with Button groups"
          >
            <Button
              variant="primary"
              onClick={() => (window.location.href = "/")}
            >
              Back
            </Button>
            <Button variant="primary" onClick={() => socket.emit("openQuiz")}>
              Quiz
            </Button>
          </ButtonToolbar>
        </Col>
        <Col xs="12" md="4">
          <Chat socket={socket} user={loggedUser} />
        </Col>
      </Row>
    </Container></div>
  );
}
