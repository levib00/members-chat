import React, { useState } from "react";
import { validateCreateDeleteMessage, validateMessageEdit } from "../utility-functions/post-fetch";
import { useNavigate } from "react-router-dom";
import { IErrorObject } from "../App";


interface IMessageInfo {
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

interface IUserObject {
  _id: any,
  username: string,
  isAdmin: boolean,
}

interface IMessagesProps {
  currentUser: IUserObject,
  messageInfo: IMessageInfo,
  setError: React.Dispatch<React.SetStateAction<IErrorObject>>,
  ws: any
};

function Message(props: IMessagesProps) {
  const {messageInfo, currentUser, setError, ws} = props;
  const {username, timestamp, content, _id} = messageInfo;

  const [messageInput, setMessageInput] = useState(content)
  const [isEditing, setIsEditing] = useState(false)
  const [validationError, setValidationError] = useState('')

  const date = new Date(timestamp);
  const navigate = useNavigate()

  const deleteMessage = async() => {
    try {
      const response = await fetch(`http://localhost:3000/messages/delete/${_id}`, {
        method: 'DELETE',
        credentials: 'include',
        //@ts-ignore
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          Authorization: (() => {
            const token = localStorage.getItem('jwt');
            if (token) {
              return 'Bearer ' + token
            }
            return null
          })()
        },      
        mode: 'cors'
      })
      validateCreateDeleteMessage(response, navigate, setValidationError, null, ws)
    } catch (error: any) {
      setError(error) // Redirect to error page if there is a non-validation error.
    }
  }

  const sendEdit = async() => {
    try {
      const response = await fetch(`http://localhost:3000/messages/edit/${_id}`, {
        method: 'PUT',
        body: JSON.stringify({content: messageInput}),
        credentials: 'include',
        //@ts-ignore
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:5173',
          Authorization: (() => {
            const token = localStorage.getItem('jwt');
            if (token) {
              return 'Bearer ' + token
            }
            return null
          })()
        },      
        mode: 'cors'
      })
      validateMessageEdit(response, navigate, setValidationError, null, ws)
    } catch (error: any) {
      setError(error) // Redirect to error page if there is a non-validation error.
    }
  }

  return (
    <div>
      <div>
        <div>
          {username?.username}
        </div>
        <div>
          {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
        </div>
        <div>
          {isEditing ? <input type='text' onChange={(e) => setMessageInput(e.target.value)} value={messageInput}/> : content}
        </div>
      </div>
      {
        ((currentUser?._id === username._id) || currentUser?.isAdmin) &&
        <div>
          {((currentUser?._id === username._id) && (isEditing ? <button onClick={() => setIsEditing(!isEditing)}>Cancel</button> : <button onClick={() => setIsEditing(!isEditing)}>Edit</button>))}
          {isEditing ? <button onClick={sendEdit}>save</button> : <button onClick={deleteMessage}>Delete</button>}
        </div>
      }
      <p>{validationError}</p>
    </div>
  )
};

export default Message