import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {submitPost, validateJoinChatroom} from '../utility-functions/post-fetch'
import { IErrorObject } from "../App"

interface chatroomInfo {
  roomName: string,
  password: string,
  isPublic: boolean,
  _id: string
}

interface ChatroomCardProps {
  chatroomInfo: chatroomInfo,
  setError: React.Dispatch<React.SetStateAction<IErrorObject>>,
  hasUser: boolean,
};

const ChatroomCard = (props: ChatroomCardProps) => {
  const { chatroomInfo, setError, hasUser } = props
  const { roomName, isPublic, _id } = chatroomInfo


  const [passwordInput, setPasswordInput] = useState('')
  const [validationError, setValidationError] = useState('')
  const [isJoining, setIsJoining] = useState(false);

  const navigate = useNavigate()

  const clickJoin = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if ((!isJoining && !isPublic) && !hasUser) {
      setIsJoining(true)
    } else if (hasUser) {
      navigate(`/chatrooms/${_id}`)
    } else {
      const response = submitPost(
        `http://localhost:3000/users/join/${_id}`,
        {password: passwordInput}, 
        e,
        validateJoinChatroom,
        setError, 
        setValidationError, 
        navigate,
        null,
        null
      )
      if ( typeof await response !== 'undefined') {
        navigate(`/chatrooms/${_id}`)
      }
    }
  }

  return (
    <div>
      <div>{roomName.charAt(0)}</div>
      <div>{roomName}</div>
      <div>{isPublic ? 'public' : 'private'}</div> 
      {isJoining ? <input type="password" onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}/> : null}
      <button onClick={(e) => clickJoin(e)}>{hasUser ? 'Chat' : 'Join'}</button>
      { validationError && <ul><li>{validationError}</li></ul> }
    </div>
  )
}

export default ChatroomCard