import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import useWebSocket from 'react-use-websocket';
// import { TextDecoder, TextEncoder } from 'util';
import { getFetcher } from '../utility-functions/fetcher';
import { submitPost, validateLeaveChatroom, validateCreateDeleteMessage } from '../utility-functions/post-fetch';
import Message from './message';
import { IErrorObject } from '../App';
import CreateChat from './create-chat';

// Defining the structure of a message object
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
}

interface IChatroomProps {
  setError: React.Dispatch<React.SetStateAction<IErrorObject | undefined>>,
}

const Chatroom = (props: IChatroomProps) => {
  const { setError } = props;
  const { chatroomId } = useParams(); // Retrieving the chatroom ID from the URL parameters
  const navigate = useNavigate(); // Accessing the navigation function from React Router

  const [messageInput, setMessageInput] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | string[]>('');
  const [leavingError, setLeavingError] = useState<string | string[]>('');
  const [isEdits, setIsEdits] = useState<null | number>(null);

  const [jwt] = useState(localStorage.getItem('jwt'));
  const { sendMessage, lastJsonMessage } = useWebSocket(`ws://localhost:3000/ws?token=${jwt}&chatroomId=${chatroomId}`, {
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: () => true,
  }); // TODO: set to wss in prod also change other links to https

  // Fetching user data using SWR (Stale-while-revalidate) pattern
  const { data: user } = useSWR('http://localhost:3000/users/user', getFetcher);

  // Fetching chatroom messages data using SWR
  const { data: response, error: commentError, mutate } = useSWR(`http://localhost:3000/messages/chatroom/${chatroomId}`, getFetcher);

  // Handling error states and redirection in case of errors
  useEffect(() => {
    setError(commentError);
    if (commentError) {
      navigate('/error');
    }
  }, [commentError]);

  const handleNewWsMessage = (message: { [key: string]: any } | undefined) => {
    const objIndex = response?.messages?.findIndex(
      ((obj: IMessageObject) => obj._id === message?._id),
    );
    if (objIndex < 0) { // Add non-existing message to DOM.
      const newMessages = [...response.messages, message];
      mutate({ ...response, messages: newMessages }, { revalidate: false });
    } else if (!message?.content) { // Remove from DOM.
      const newMessages = [...response.messages];
      newMessages.splice(objIndex, 1);
      mutate({ ...response, messages: newMessages }, { revalidate: false });
    } else { // Edit existing message.
      const newMessages = [...response.messages];
      newMessages[objIndex] = message;
      mutate({ ...response, messages: newMessages }, { revalidate: false });
    }
  };

  const handleSendMessage = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Logic to handle sending a message in the chatroom
    if (messageInput.length < 1) {
      return;
    }
    setMessageInput('');
    const date = new Date(Date.now());
    handleNewWsMessage({
      username: user,
      timestamp: date,
      content: messageInput,
    });
    const jsonResponse = await submitPost(
      `http://localhost:3000/messages/${chatroomId}`,
      { content: messageInput },
      e,
      validateCreateDeleteMessage,
      setValidationError,
      navigate,
      null,
      sendMessage,
    );

    if (await jsonResponse.error) {
      handleNewWsMessage({});
      setValidationError(jsonResponse.error.map((error: string) => error));
    } else {
      mutate();
    }
  };

  const leaveChat = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Logic to handle leaving the chatroom
    submitPost(
      `http://localhost:3000/users/leave/${chatroomId}`,
      { content: messageInput },
      e,
      validateLeaveChatroom,
      setLeavingError,
      navigate,
      null,
      () => null,
    );
  };

  useEffect(() => {
    if (lastJsonMessage !== null) {
      handleNewWsMessage(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  return (
      <div>
        {/* Rendering the modal for creating/editing a chatroom */}
        {(modalIsOpen
          && <div>
            <CreateChat chatroom={response?.chatroom} isAnEdit={true} />
            <button onClick={() => setModalIsOpen(false)}>cancel</button>
          </div>)}
        <div>
          {/* Displaying chatroom details and buttons */}
          <h2>{response?.chatroom.roomName}</h2>
          {(response?.chatroom.createdBy === user?._id)
            ? <button onClick={() => setModalIsOpen(true)}>Edit chatroom</button> : null}
          <button onClick={(e) => leaveChat(e)}>Leave chat</button>
          {leavingError || null}
        </div>
        {/* Mapping through messages and rendering each message */}
        {
          response?.messages?.map((message: IMessageObject, index: number) => <Message
            key={(uuid())}
            index={index}
            toggle={() => setIsEdits((s) => (s === index ? null : index))}
            currentUser={ user }
            messageInfo={ message }
            sendMessage={ sendMessage }
            handleNewWsMessage={ handleNewWsMessage }
            isEdits={isEdits === index} />) // TODO: rename isEdits.
        }
        <div>
          {/* Input box for sending messages and handling message sending */}
          <label htmlFor="message-box"></label>
          <input id="message-box" type="text" required min={1} max={300} onChange={(e) => setMessageInput(e.target.value)} value={messageInput} />
          <div>
            <button onClick={(e) => handleSendMessage(e)}>Send</button>
            {
              validationError
              && <ul>
                {
                  Array.isArray(validationError)
                    ? validationError.map((error: string) => <li key={uuid()}>{error}</li>)
                    : <li key={uuid()}>{validationError}</li>
                }
              </ul>
              }
          </div>
        </div>
      </div>
  );
};

export default Chatroom;
