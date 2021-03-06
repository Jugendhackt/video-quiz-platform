import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import { Button } from "react-bootstrap";
import { Room, User } from "interfaces";


const socket = socketIOClient();
function SocketPage() {
  const [userList, setUserList] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [room, setRoom] = useState<Room>();
  const [msg, setMsg] = useState("");
  const [recMsg, setRecMsg] = useState({
    listMsg: [] as any[],
  });
  const [video, setVideo] = useState<Record<string, any> | null>(null);
  const [loggedUser, setLoggedUser] = useState<User>();

  const [name, setName] = React.useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);

  const onNameChanged = (name : string) => {
    localStorage.setItem('name', name);
    setName(name);
  };

  useEffect(() => {
    var temporaryName = localStorage.getItem('name') ?? Math.random().toString(36).substring(7);

    setName(temporaryName);
    connect(temporaryName);
    // list of connected users
    socket.on("users", (data) => {
      console.log("Retrieved users!");
      setUserList(JSON.parse(data));
    });
    // we get the messages
    socket.on("getMsg", (data) => {
      console.log("Retrieved message!");
      console.log(data);
      let listMessages = recMsg.listMsg;
      listMessages.push(JSON.parse(data));
      setRecMsg({ listMsg: listMessages });
    });
  }, []);


  // to send a message
  const sendMessage = () => {
    socket.emit("sendMsg", JSON.stringify({ id: loggedUser?.id, msg: msg }));
    setMsg("");
  };
  // get the logged user
  socket.on("connecteduser", (data) => {
    console.log("Connected!");
    setLoggedUser(JSON.parse(data));
    socket.emit("getRooms");
    socket.emit("getRoom");
    setConnected(true);
  });

  socket.on("getRooms", (data) => setRooms(data));
  socket.on("getRoom", (data) => {
    console.log(data);
    return setRoom(data);
  });
  socket.on("play", (data) => setVideo(data));

  socket.on("openQuiz", (quiz) => console.log(quiz));

  const openQuiz = () => {
    socket.emit("openQuiz");
  };

  const connect = (name: string) => {
    setName(name);
    // subscribe a new user
    socket.emit("login", name);
  };

  return (
    <div>
      <input
        style={{ width: "300px", display: "inline" }}
        value={name}
        onChange={(event) => onNameChanged(event.target.value)}
      />
      <Button
        variant="outline-primary"
        onClick={() => {
          if (socket.connected) {
            socket.disconnect();
            socket.connect();

            connect(name);
          }
        }}>
        Set name
      </Button>
      
      <Button
        variant="outline-primary"
        onClick={() => {
          if(connected)
            socket.disconnect();
          else
            socket.connect();
          setConnected(!connected);
        }}>
        {connected ? "Disconnect" : "Connect"}
      </Button>

      <Button variant="outline-primary"
      href="/index">
        <a>Mainpage</a>
      </Button>
      
      
      

      {rooms && (
        <ul>
          {rooms.map((room, index) => (
            <li key={room.topic}>
              {room.topic}
              <Button
                variant="outline-primary"
                onClick={() => socket.emit("setRoom", index)}
              >
                Set room
              </Button>
            </li>
          ))}
        </ul>
      )}
      {room && (
        <div>
          <h3>Current room</h3>
          <p>Topic: {room.topic}</p>
          <p>Subject: {room.subject}</p>
          <img src={room.image} height={50} />
          <p>Question count: {room.questionCount?.toString()}</p>
          <Button
            variant="outline-primary"
            onClick={() => socket.emit("loadRoom")}
          >
            Load
          </Button>
        </div>
      )}
      <h3 className="d-flex justify-content-center">
        Connected users : {userList?.length}
      </h3>
      <table className="table">
        <thead>
          <tr>
            <th> User name </th>
            <th> Connection Date </th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => {
            return (
              <tr key={user.id}>
                <td> {user.userName} </td>
                <td> {user.connectionTime} </td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
      <h3 className="d-flex justify-content-center">
        {" "}
        User : {loggedUser?.userName}{" "}
      </h3>
      <div style={{ borderStyle: "inset" }}>
        <h2 className="d-flex justify-content-center"> Chat </h2>
        {recMsg.listMsg?.map((msgInfo, index) => {
          return (
            <div className="d-flex justify-content-center" key={index}>
              {" "}
              <b>{msgInfo.userName ?? <u>System</u>} </b> : {msgInfo.msg}{" "}
              <small
                style={{ marginLeft: "18px", color: "blue", marginTop: "5px" }}
              >
                {" "}
                {msgInfo.time}{" "}
              </small>{" "}
            </div>
          );
        })}
      </div>
      <div className="d-flex justify-content-center">
        <input
          style={{ width: "300px", display: "inline" }}
          id="inputmsg"
          value={msg}
          onChange={(event) => setMsg(event.target.value)}
        />
        <Button variant="outline-primary" onClick={sendMessage}>
          Send
        </Button>
      </div>
      <Button variant="outline-primary" onClick={openQuiz}>
        Open quiz
        </Button>
    </div>
  );
}
export default SocketPage;
