import React, { useState } from "react";
import { getFetcher } from "../utility-functions/fetcher";
import { submitPost, validateLeaveChatroom } from '../utility-functions/post-fetch'
import { validateCreateDeleteMessage } from "../utility-functions/post-fetch"
import Message from "./message"
import useSWR from "swr";
import { v4 as uuid } from "uuid"
import { useNavigate, useParams } from "react-router-dom";
import { IErrorObject } from "../App";
import CreateChat from "./create-chat";

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

  const {data: user,  error: userError} = useSWR(`http://localhost:3000/users/user`, getFetcher)

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    submitPost(
      `http://localhost:3000/messages/${chatroomId}`,
      {content: messageInput}, 
      e,
      validateCreateDeleteMessage,
      setError, 
      setValidationError, 
      navigate,
      null,
    )
  };

  const {data: response,  error: commentError} = useSWR(`http://localhost:3000/messages/chatroom/${chatroomId}`, getFetcher)

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
    )
  }
  
  return (
      <div>
        {modalIsOpen &&
          <div>
            <CreateChat chatroom={response.chatroom} setError={setError} isAnEdit={true} />
            <button onClick={() => setModalIsOpen(false)}>cancel</button> { /*might move into create chat component */}
          </div>}
        <div>
          <h2>{response?.chatroom.roomName}</h2>
          {(response?.chatroom.createdBy === user?._id) ? <button onClick={() => setModalIsOpen(true)}>Edit</button> : null}
          <button onClick={(e) => leaveChat(e)}>Leave chat</button>
          {leavingError ? leavingError : null}
        </div>
        { response?.messages?.map((message: IMessageObject) => <Message key={uuid()} setError={ setError } currentUser={ user } messageInfo={ message } />) }
        <div>
          <label htmlFor="message-box"></label>
          <input id="message-box" type="text" onChange={(e) => setMessageInput(e.target.value)} value={messageInput} />
          <div>
            <button onClick={sendMessage}>Send</button>
            {
              validationError && 
              <ul>
                <li>{validationError}</li>
              </ul>
            }
          </div>
        </div>
      </div>
  )
}

export default Chatroom