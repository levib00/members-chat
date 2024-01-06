import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import useWebSocket from 'react-use-websocket';
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
  const [isBeingEdited, setIsBeingEdited] = useState<null | number>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<null | number>(null);

  const [jwt] = useState(localStorage.getItem('jwt'));
  const { sendMessage, lastJsonMessage } = useWebSocket(`ws://localhost:3000/ws?token=${jwt}&chatroomId=${chatroomId}`, {
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: () => true,
  }); // TODO: set to wss in prod also change other links to https

  // Fetching user data using SWR (Stale-while-revalidate) pattern
  const { data: user } = useSWR('https://levib00-chatroom.adaptable.app/api/users/user', getFetcher);

  // Fetching chatroom messages data using SWR
  const { data: response, error: commentError, mutate } = useSWR(`https://levib00-chatroom.adaptable.app/api/messages/chatroom/${chatroomId}`, getFetcher);

  // Handling error states and redirection in case of errors
  useEffect(() => {
    setError(commentError);
    if (commentError) {
      navigate('/members-chat/error');
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
      `https://levib00-chatroom.adaptable.app/api/messages/${chatroomId}`,
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
      `https://levib00-chatroom.adaptable.app/api/users/leave/${chatroomId}`,
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
      <div className='main chatroom-page'>
        {/* Rendering the modal for creating/editing a chatroom */}
        {(modalIsOpen
          && <div>
            <CreateChat chatroom={response?.chatroom} isAnEdit={true} />
            <button onClick={() => setModalIsOpen(false)}>cancel</button>
          </div>)}
        <div className='chatroom-header'>
          {/* Displaying chatroom details and buttons */}
          <h2>{response?.chatroom.roomName}</h2>
          <div className='chatroom-header-buttons'>
            {(response?.chatroom.createdBy === user?._id)
              ? <button onClick={() => setModalIsOpen(true)}>Edit chatroom</button> : null}
            <button onClick={(e) => leaveChat(e)}>Leave chat</button>
            {leavingError || null}
          </div>
        </div>
        {/* Mapping through messages and rendering each message */}
        <div className='message-list'>
          {response?.messages.length > 0 ? [...response.messages].reverse().map(
            (message: IMessageObject, index: number) => <Message
              key={(uuid())}
              index={index}
              toggleEditing={() => setIsBeingEdited((s) => (s === index ? null : index))}
              toggleDeleteModal={() => setDeleteConfirmation((s) => (s === index ? null : index))}
              currentUser={ user }
              messageInfo={ message }
              sendMessage={ sendMessage }
              handleNewWsMessage={ handleNewWsMessage }
              isBeingEdited={isBeingEdited === index}
              deleteConfirmation={deleteConfirmation === index} />,
          )
            : <div className='no-messages-fallback message'>Be the first to send a message!</div>
          }
        </div>
        <div className='create-message'>
          {/* Input box for sending messages and handling message sending */}
          <div className='message-form'>
            <label className='message-box-label' htmlFor="message-box"></label>
            <textarea id="message-box" className='message-box' required minLength={1} maxLength={300} onChange={(e) => setMessageInput(e.target.value)} value={messageInput} />
            <button onClick={(e) => handleSendMessage(e)}>Send</button>
          </div>
          <div>
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
