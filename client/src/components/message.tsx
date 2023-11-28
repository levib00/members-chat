import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { validateCreateDeleteMessage, validateMessageEdit } from '../utility-functions/post-fetch';
import parseDom from '../utility-functions/dom-parser';

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

interface IUserObject {
  _id: any,
  username: string,
  isAdmin: boolean,
}

interface IMessagesProps {
  currentUser: IUserObject,
  messageInfo: IMessageInfo,
  sendMessage: (message: string) => void,
  handleNewWsMessage: (message: { [key: string]: any; } | undefined) => void
  isEdits: boolean,
  index: number,
  toggle: () => void
}

function Message(props: IMessagesProps) {
  const {
    messageInfo, currentUser, sendMessage, handleNewWsMessage, isEdits, toggle,
  } = props;
  const {
    username, timestamp, content, _id: id,
  } = messageInfo;

  const [messageInput, setMessageInput] = useState(() => parseDom(content));
  const [validationError, setValidationError] = useState<string | Array<string>>('');
  const date = new Date(timestamp);
  const navigate = useNavigate();

  const deleteMessage = async () => {
    handleNewWsMessage({ _id: messageInfo._id });
    try {
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
      validateCreateDeleteMessage(response, navigate, setValidationError, null, sendMessage);
    } catch (error: any) { //
      setValidationError(error); // Redirect to error page if there is a non-validation error.
      handleNewWsMessage({ messageInfo });
    }
  };

  const sendEdit = async () => {
    try {
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
      validateMessageEdit(response, navigate, setValidationError, null, sendMessage);
    } catch (error: any) {
      setValidationError(error); // Redirect to error page if there is a non-validation error.
    }
  };

  return (
    <div>
      <div>
        <div>
          {parseDom(username?.username)}
        </div>
        <div>
          {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
        </div>
        <div>
          {isEdits ? <input type='text' onChange={(e) => setMessageInput(e.target.value)} value={messageInput}/> : parseDom(content)}
        </div>
      </div>
      {
        ((currentUser?._id && currentUser._id === username?._id) || currentUser?.isAdmin)
        && <div>
          {((currentUser?._id === username._id) && (
            isEdits
              ? <button onClick={toggle}>Cancel</button> : <button onClick={toggle}>Edit</button>
          ))}
          {isEdits
            ? <button onClick={sendEdit}>
                save
              </button> : <button onClick={deleteMessage}>
                Delete
              </button>}
        </div>
      }

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
