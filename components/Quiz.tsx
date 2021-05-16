import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'

interface QuizProps {
    questions : any[] | undefined;
}
export default function Quiz({questions} : QuizProps) {
    const [opened, setOpened] = useState(true);

    
    return (
        <Modal show={questions != null && opened} animation={false} onHide={
            () => setOpened(false)
        }>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {questions &&
                        questions?.map((question, questionIndex) => {
                            <div>
                            <h2>{question["content"]}</h2>
                            {(question["answers"] as []).map((answer, answerIndex) => {
                                <div>
                            <input type="radio" name="Antwort" id={questionIndex + "-" + answerIndex}></input>
                            <label htmlFor={questionIndex + "-" + answerIndex}>{answer}</label>
                            </div>
                            })}
                            </div>
                        })
            }
            <form>
                        <input type="submit" value="senden"></input>
                    </form>
                    </Modal.Body>
                    </Modal>

    )
}
