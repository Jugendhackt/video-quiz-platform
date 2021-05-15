import Chat from 'components/Chat'
import ChooseRoom from 'components/ChooseRoom'
import React from 'react'
import { Button, ButtonToolbar, Col, Container, Row } from 'react-bootstrap'

export default function ChatPage() {
    return (
        <Container fluid={true}>
            <Row>
                <Col xs="12" sm="10" md="6">
                    <div
                        style={{
                            position: "relative",
                            paddingBottom: "56.25%" /* 16:9 */,
                            paddingTop: 25,
                            height: 0
                        }}
                    >
                        <iframe
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: 0
                            }}
                            src="https://www.youtube-nocookie.com/embed/MsrrKMzLeWE" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={false}></iframe>
                    </div>
                    <br />
                    <ChooseRoom />
                    <ButtonToolbar className="justify-content-between" aria-label="Toolbar with Button groups">
                        <Button variant="primary" onClick={() => console.log("hallo welt")}>Back</Button>
                        <Button variant="primary" onClick={() => console.log("test")}>Quiz</Button>
                    </ButtonToolbar>
                </Col>
                <Col xs="12" md="6">
                    <Chat /> 
                </Col>
            </Row>
        </Container>

    )
}
