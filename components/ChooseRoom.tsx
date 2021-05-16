import { Room } from 'interfaces';
import { SocketProps } from 'interfaces/props';
import React, { useEffect, useState } from 'react'
import {Button, Media } from 'react-bootstrap'

interface ChooseRoomProps extends SocketProps {
  rooms : Room[] | undefined;
}

export default function ChooseRoom({rooms, socket} : ChooseRoomProps) {
  
  return (
    <div>
      {/* https://react-bootstrap.netlify.app/layout/grid/ */}
      {rooms?.map((room : Room, index) => (
        <Media key={room.topic}>
        <img
          width={156}
          className="mr-3"
          src={room.image}
          alt="Generic placeholder"
        />
        <Media.Body>
          <h5>{room.topic}</h5>
          <p>
            {room.subject}
          </p>
        <Button variant="warning" onClick={() => socket.emit("setRoom", index)}>Set room</Button>
        </Media.Body>
      </Media>
      ))}
    </div>
  )
}
