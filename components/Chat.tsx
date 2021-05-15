import React from 'react'
import { Button, Form, Col, Row } from 'react-bootstrap'

export default function Chat() {
    return (
        <Form>
            <Row>
                <Col><Form.Control type="comment" className="form-control" placeholder="Hier antworten" id="Textmessage" /></Col>
                <Col md="auto"><Button variant="primary" onClick={() => console.log("test2")}>Absenden</Button></Col>
            </Row>
        </Form>
    )
}
