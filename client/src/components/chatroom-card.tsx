import React, { useState } from "react"
import { Link } from "react-router-dom"

interface chatroomInfo {
  name: string,
  password: string,
  isPublic: boolean,
  chatroomId: string
}

interface ChatroomCardProps {
  chatroomInfo: chatroomInfo,
};

const ChatroomCard = (props: ChatroomCardProps) => {
  const {chatroomInfo} = props
  const {name, password, isPublic, chatroomId} = chatroomInfo



  return (
    <Link to='/'>
      <div>
        <div>{name.charAt(0)}</div>
        <div>{name}</div>
        <div>{isPublic ? 'public' : 'private'}</div> 
      </div>
    </Link>
  )
}

export default ChatroomCard