import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import Icon from '@mdi/react';
import {
  mdiSquareEditOutline as editIcon,
  mdiDelete as deleteIcon,
  mdiCloseThick as closeIcon,
  mdiCheckBold as checkIcon,
} from '@mdi/js';
import { validateCreateDeleteMessage, validateMessageEdit } from '../utility-functions/post-fetch';
import parseDom from '../utility-functions/dom-parser';

// Interface defining the structure of message information
interface IMessageInfo {
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

// Interface defining the structure of a user object
interface IUserObject {
  _id: any,
  username: string,
  isAdmin: boolean,
}

// Props interface for the Message component
interface IMessagesProps {
  currentUser: IUserObject, // Current user information
  messageInfo: IMessageInfo, // Information about the message
  sendMessage: (message: string) => void, // Function to send a message
  // Handler for new WebSocket message
  handleNewWsMessage: (message: { [key: string]: any; } | undefined) => void,
  isEdits: boolean, // Indicates if the message is being edited
  index: number, // Index of the message
  toggle: () => void // Function to toggle editing state
}

// Message functional component that displays a message and manages its actions
function Message(props: IMessagesProps) {
  const {
    messageInfo, currentUser, sendMessage, handleNewWsMessage, isEdits, toggle,
  } = props;

  // Destructuring message information
  const {
    username, timestamp, content, _id: id,
  } = messageInfo;

  // State variables for managing message input, validation error, date, navigation
  const [messageInput, setMessageInput] = useState(() => parseDom(content));
  const [validationError, setValidationError] = useState<string | Array<string>>('');
  const date = new Date(timestamp);
  const navigate = useNavigate();

  // Function to delete a message
  const deleteMessage = async () => {
    // Update the UI with the deleted message
    handleNewWsMessage({ _id: messageInfo._id });
    try {
      // Perform a DELETE request to delete the message
      const response = await fetch(`http://localhost:3000/messages/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        // @ts-ignore
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          Authorization: (() => {
            const token = localStorage.getItem('jwt');
            if (token) {
              return `Bearer ${token}`;
            }
            return null;
          })(),
        },
        mode: 'cors',
      });
      // Validate the deletion and handle potential errors
      validateCreateDeleteMessage(response, navigate, setValidationError, null, sendMessage);
    } catch (error: any) {
      setValidationError(error); // Redirect to an error page if there's a non-validation error
    }
  };

  // Function to send an edited message
  const sendEdit = async () => {
    toggle(); // Toggle the editing state
    // Update the message content and send it
    handleNewWsMessage({
      username,
      timestamp: date,
      content: messageInput,
      _id: id,
    });
    try {
      // Perform a PUT request to edit the message
      const response = await fetch(`http://localhost:3000/messages/edit/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ content: messageInput }),
        credentials: 'include',
        // @ts-ignore
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          Authorization: (() => {
            const token = localStorage.getItem('jwt');
            if (token) {
              return `Bearer ${token}`;
            }
            return null;
          })(),
        },
        mode: 'cors',
      });
      // Validate the message edit and handle potential errors
      validateMessageEdit(response, navigate, setValidationError, null, sendMessage);
    } catch (error: any) {
      setValidationError(error); // show user an error if one is received.
    }
  };

  // TODO: add confirmation on delete

  // JSX rendering for displaying the message and its actions
  return (
    <div className='message'>
      <div className='spacer'></div>
      {/* Display message information */}
      <div>
        <div className='inline'>
          <div>
            <div className='message-username'>
              {parseDom(username?.username)}
            </div>
            <div className='message-date'>
              {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
            </div>
          </div>
          {/* Actions based on user's privileges */}
      {
        ((currentUser?._id && currentUser._id === username?._id) || currentUser?.isAdmin)
        && <div className='message-button-container'>
          {((currentUser?._id === username._id) && (
            isEdits
              ? <button onClick={toggle}>
                <Icon path={closeIcon}
                  title='more'
                  size={1}
                />
                </button> : <button onClick={toggle}>
                <Icon path={editIcon}
                  title='more'
                  size={1}
                />
                </button>
          ))}
          {
            isEdits
              ? <button onClick={sendEdit}>
                  <Icon path={checkIcon}
                  title='more'
                  size={1}
                />
                </button> : <button onClick={deleteMessage}>
                <Icon path={deleteIcon}
                  title='more'
                  size={1}
                />
                </button>
            }
        </div>
      }
        </div>
        <div className='message-content'>
          {/* Display the message content or an input field based on the editing state */}
          {isEdits ? <textarea onChange={
            (e) => setMessageInput(e.target.value)
          } value={messageInput}/>
            : parseDom(content)
          }
        </div>
      </div>
      {/* Display validation errors if any */}
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
  );
}

export default Message;
