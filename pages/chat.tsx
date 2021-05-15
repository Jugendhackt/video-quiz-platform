import React from 'react'
import { Button } from 'react-bootstrap'

export default function ChatPage() {
    return (
        <div>
            <div>
            <iframe className="video" src="https://www.youtube.com/embed/MsrrKMzLeWE" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            <div style={{textAlign: "right"}} className="Quiz-Button">
                <Button variant="primary">Quiz</Button>
            </div>
            <br />
            <div style={{textAlign: "left"}} className="Back-Button">
                <Button variant="primary">Back</Button>
            </div>
        </div>
        
    )
}
