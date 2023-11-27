import React, { useEffect, useState } from "react";
import { getFetcher } from "../utility-functions/fetcher";
import { submitPost, validateLeaveChatroom } from '../utility-functions/post-fetch';
import { validateCreateDeleteMessage } from "../utility-functions/post-fetch";
import Message from "./message";
import { IErrorObject } from "../App";
import useSWR from "swr";
import { useNavigate, useParams } from "react-router-dom";
import CreateChat from "./create-chat";
import { v4 as uuid } from "uuid";
import mongoose from "mongoose";
import useWebSocket from 'react-use-websocket';

interface IMessageObject {
  username: {
    _id: any,
    firstName: string,
    lastName: string,
    username: string
  },
  timestamp: Date,
  content: string,
  _id: any
};

interface IChatroomProps {
  setError: React.Dispatch<React.SetStateAction<IErrorObject | undefined>>,
}

const Chatroom = (props: IChatroomProps) => {
  const { setError } = props
  const { chatroomId } = useParams()
  const navigate = useNavigate()
  
  const [messageInput, setMessageInput] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [validationError, setValidationError] = useState<string | Array<string>>('')
  const [leavingError, setLeavingError] = useState<string | string[]>('')
  const [isEdits, setIsEdits] = useState<null | number>(null)

  const [jwt] = useState(localStorage.getItem('jwt'))
  const { sendMessage, lastJsonMessage, readyState } = useWebSocket(`ws://localhost:3000/ws?token=${jwt}&chatroomId=${chatroomId}`, {
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  }); // TODO: set to wss in prod also change other links to https

  const {data: user,  error: userError} = useSWR(`http://localhost:3000/users/user`, getFetcher)

  const handleSendMessage = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setMessageInput('');
    const objectId = new mongoose.Types.ObjectId();
    const date = new Date(Date.now());
    handleNewWsMessage({
      username: user,
      timestamp: date,
      content: messageInput,
      _id: objectId
    });
    const jsonResponse = await submitPost(
      `http://localhost:3000/messages/${chatroomId}`,
      {content: messageInput, _id: objectId}, 
      e,
      validateCreateDeleteMessage,
      setValidationError, 
      navigate,
      null,
      sendMessage
    )
    
    if (await jsonResponse.error) {
      handleNewWsMessage({_id: objectId})
      setValidationError('Message could not be sent')
    }
  };

  const {data: response,  error: commentError, mutate} = useSWR(`http://localhost:3000/messages/chatroom/${chatroomId}`, getFetcher)

  const leaveChat = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    submitPost(
      `http://localhost:3000/users/leave/${chatroomId}`,
      {content: messageInput}, 
      e,
      validateLeaveChatroom,
      setLeavingError, 
      navigate,
      null,
      () => null
    )
  }

  const handleNewWsMessage = (message: {[key: string]: any}| undefined) => {
    const objIndex = response?.messages?.findIndex(((obj: IMessageObject ) => obj._id === message?._id))
    if (objIndex < 0) { // Add non-existing message to DOM.
      const newMessages = [...response.messages, message]
      mutate({ ...response, messages: newMessages}, { revalidate: false })
    } else if (!message?.content) { // Remove from DOM.
      const newMessages = [...response.messages]
      newMessages.splice(objIndex, 1)
      mutate({ ...response, messages: newMessages}, {revalidate: false})
    } else { // Edit existing message.
      const newMessages = [...response.messages]
      newMessages[objIndex] = message
      mutate({ ...response, messages: newMessages})
    }
  }

  useEffect(() => {
    if (lastJsonMessage !== null) {
      handleNewWsMessage(lastJsonMessage);
    }
  }, [lastJsonMessage])
  
  return (
      <div>
        {modalIsOpen &&
          <div>
            <CreateChat chatroom={response?.chatroom} isAnEdit={true} />
            <button onClick={() => setModalIsOpen(false)}>cancel</button>
          </div>}
        <div>
          <h2>{response?.chatroom.roomName}</h2>
          {(response?.chatroom.createdBy === user?._id) ? <button onClick={() => setModalIsOpen(true)}>Edit</button> : null}
          <button onClick={(e) => leaveChat(e)}>Leave chat</button>
          {leavingError ? leavingError : null}
        </div>
        { response?.messages?.map((message: IMessageObject, index: number) => <Message key={(uuid())} index={index} toggle={() => setIsEdits(s => s === index ? null : index)} currentUser={ user } messageInfo={ message } sendMessage={ sendMessage } handleNewWsMessage={ handleNewWsMessage } isEdits={isEdits === index} />) }
        <div>
          <label htmlFor="message-box"></label>
          <input id="message-box" type="text" required min={1} max={300} onChange={(e) => setMessageInput(e.target.value)} value={messageInput} />
          <div>
            <button onClick={(e) =>handleSendMessage(e)}>Send</button>
            {
              validationError && 
              <ul> 
                { 
                  Array.isArray(validationError) ? 
                    validationError.map((error: string) => <li key={uuid()}>{error}</li>)
                    :
                    <li key={uuid()}>{validationError}</li>
                }
              </ul>
            }
          </div>
        </div>
      </div>
  )
}

export default Chatroom