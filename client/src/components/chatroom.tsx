import React, { useEffect, useState } from "react";
import { getFetcher } from "../utility-functions/fetcher";
import { submitPost, validateLeaveChatroom } from '../utility-functions/post-fetch'
import { validateCreateDeleteMessage } from "../utility-functions/post-fetch"
import Message from "./message"
import useSWR from "swr";
import { useNavigate, useParams } from "react-router-dom";
import { IErrorObject } from "../App";
import CreateChat from "./create-chat";
import { v4 as uuid } from "uuid"

interface IMessageObject {
  username: {
    _id: any,
    firstName: string,
    lastName: string,
    username: string
  },
  timestamp: string,
  content: string,
  _id: any
};

interface IChatroomProps {
  setError: React.Dispatch<React.SetStateAction<IErrorObject>>,
}

const Chatroom = (props: IChatroomProps) => {
  const { setError } = props
  const { chatroomId } = useParams()
  const navigate = useNavigate()
  
  const [messageInput, setMessageInput] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [leavingError, setLeavingError] = useState('')
  const [jwt] = useState(localStorage.getItem('jwt'))
  const [ws] = useState(new WebSocket(`ws://localhost:3000/ws?token=${jwt}`)) // TODO: set to wss in prod also change other links to https

  const {data: user,  error: userError} = useSWR(`http://localhost:3000/users/user`, getFetcher)

  const handleSendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setMessageInput('')
    submitPost(
      `http://localhost:3000/messages/${chatroomId}`,
      {content: messageInput}, 
      e,
      validateCreateDeleteMessage,
      setError, 
      setValidationError, 
      navigate,
      null,
      ws
    )
  };

  const {data: response,  error: commentError, mutate} = useSWR(`http://localhost:3000/messages/chatroom/${chatroomId}`, getFetcher)

  const leaveChat = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    submitPost(
      `http://localhost:3000/users/leave/${chatroomId}`,
      {content: messageInput}, 
      e,
      validateLeaveChatroom,
      setError, 
      setLeavingError, 
      navigate,
      null,
      null
    )
  }

  const handleNewWsMessage = (message: IMessageObject) => {
    const objIndex = response?.messages?.findIndex(((obj: IMessageObject ) => obj._id === message._id))

    if (objIndex < 0) {
      const newMessages = [...response.messages, message]
      mutate({ ...response, messages: newMessages})
    } else if (!message.content) {
      const newMessages = [...response.messages]
      newMessages.splice(objIndex, 1)
      mutate({ ...response, messages: newMessages})
    } else {
      const newMessages = [...response.messages]
      newMessages[objIndex] = message
      mutate({ ...response, messages: newMessages})
    }
  }
  useEffect(() => {
    ws.onmessage = function (event: any) {
      
      const json = JSON.parse(event.data);
      try {
        handleNewWsMessage(json);
      } catch (err) {
        console.log(err);
      }
    }
  })
  
  return (
      <div>
        {modalIsOpen &&
          <div>
            <CreateChat chatroom={response?.chatroom} setError={setError} isAnEdit={true} />
            <button onClick={() => setModalIsOpen(false)}>cancel</button>
          </div>}
        <div>
          <h2>{response?.chatroom.roomName}</h2>
          {(response?.chatroom.createdBy === user?._id) ? <button onClick={() => setModalIsOpen(true)}>Edit</button> : null}
          <button onClick={(e) => leaveChat(e)}>Leave chat</button>
          {leavingError ? leavingError : null}
        </div>
        { response?.messages?.map((message: IMessageObject) => <Message key={(uuid())} setError={ setError } currentUser={ user } messageInfo={ message } ws={ ws } />) }
        <div>
          <label htmlFor="message-box"></label>
          <input id="message-box" type="text" onChange={(e) => setMessageInput(e.target.value)} value={messageInput} />
          <div>
            <button onClick={(e) =>handleSendMessage(e)}>Send</button>
            {
              validationError && 
              <ul>
                <li key={uuid()}>{validationError}</li>
              </ul>
            }
          </div>
        </div>
      </div>
  )
}

export default Chatroom