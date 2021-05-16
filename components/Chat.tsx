import { SocketProps } from 'interfaces/props'
import React, { useEffect, useState, useRef } from 'react'
import { Button, Form, Col, Row, Container } from 'react-bootstrap'

interface ChatProps extends SocketProps {
}
export default function Chat({socket, user} : ChatProps) {
    const [msg, setMsg] = useState("");
    const lastMessageRef = useRef<HTMLElement>(null);

    const sendMsg = () => {
        socket.emit("sendMsg", JSON.stringify({ id: user?.id, msg: msg }));
        setMsg("");
        
    }
    const [messages, setMessages] = useState<any[]>([]);
    useEffect(() => {
        console.log("EFFECT");
    socket.on("getMsg", (data) => {
        console.log("Retrieved message!");
        console.log(data);
        let listMessages = messages;
        listMessages.push(JSON.parse(data));
        setMessages(listMessages);
      });
    }, [])

    return (
        <div className={"h-100 d-flex flex-column"} style={{maxHeight: "100vh"}}>
            <div className="align-self-stretch flex-grow-1 overflow-auto">
        {messages?.map((msg, index) => (
            <div className="d-flex justify-content-center" key={index}>
              {" "}
              <b ref={index +1 >= messages?.length ? lastMessageRef : null}>{msg.userName ?? <u>System</u>} </b> : {msg.msg}{" "}
              <small
                style={{ marginLeft: "18px", color: "blue", marginTop: "5px" }}
              >
                {" "}
                {msg.time}{" "}
              </small>{" "}
            </div>
                ))}
            </div>
            <div className="bg-enter">
                <Form>
                    <Row>
                        <Col><Form.Control type="comment" className="form-control" placeholder="Hier antworten" id="Textmessage"
                            value={msg}
                            onKeyDown={(event : any) => {
                                if (event.key === "Enter")
                                    sendMsg();
                            }}
                            onChange={(event) => setMsg(event.target.value)}
                        /></Col>
                        <Col md="auto"><Button variant="primary" onClick={() => sendMsg()}>Absenden</Button></Col>
                    </Row>
                </Form>
            </div>
        </div>
    )
}


