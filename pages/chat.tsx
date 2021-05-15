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
                    ></div>
                    <form><input type="radio" name="Antwort" id="Antwort 1"></input>
                        <label for="Antwort 1">etwas</label>
                        <br />
                        <input type="radio" name="Antwort" id="Antwort 2"></input>
                        <label for="Antwort 2">anderes</label>
                        <br />
                        <input type="radio" name="Antwort" id="Antwort 3"></input>
                        <label for="Antwort 3">nochwasanderes</label>
                        <br />
                        <input type="submit" value="senden"></input>
                    </form>
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
