import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { validateCreateChat, submitPost } from '../utility-functions/post-fetch';

// Props interface for the CreateChat component
interface ICreateChatProps {
  isAnEdit: boolean,
  chatroom: {
    roomName: string,
    isPublic: boolean,
  } | null
}

// CreateChat functional component
const CreateChat = (props: ICreateChatProps) => {
  const { isAnEdit, chatroom } = props;

  // State variables for managing input fields and their values
  const [chatNameInput, setChatNameInput] = useState(chatroom?.roomName || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [validationError, setValidationError] = useState<string | string[]>('');
  const [isTheSame] = useState(passwordInput === confirmPasswordInput);
  const [isPublic, setIsPublic] = useState(chatroom?.isPublic || false);
  const navigate = useNavigate();

  const { chatroomId } = useParams();// Retrieving chatroom ID from URL parameters

  const submitForm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (isTheSame) {
      // Handling submission for editing an existing chatroom
      if (isAnEdit) {
        try {
          // Performing a PUT request to update an existing chatroom
          const response = await fetch(`http://localhost:3000/chatrooms/edit/${chatroomId}`, {
            method: 'PUT',
            body: JSON.stringify({
              roomName: chatNameInput,
              password: isPublic ? '' : passwordInput,
              passwordConfirmation: isPublic ? '' : confirmPasswordInput,
              isPublic,
            }),
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
          validateCreateChat(response, navigate, setValidationError);
        } catch (error: any) {
          setValidationError(error); // Give error to user.
        }
      } else {
        // Handling submission for creating a new chatroom
        submitPost(
          'http://localhost:3000/chatrooms/new',
          {
            roomName: chatNameInput,
            password: passwordInput,
            passwordConfirmation: confirmPasswordInput,
            isPublic,
          },
          e,
          validateCreateChat,
          setValidationError,
          navigate,
          null,
          () => null,
        );
      }
    } else {
      setValidationError('Passwords don\'t match.');
    }
  };

  return (
    <form>
      {/* Input fields for chatroom details */}
      <div>
        <label htmlFor='chat-name'>Chat Name:</label>
        <input type='text' id='chat-name' required onChange={(e) => setChatNameInput(e.target.value)} value={chatNameInput}></input>
      </div>
      <div>
        <label htmlFor='password'>Password:</label>
        <input disabled={isPublic} type='password' id='password' onChange={(e) => setPasswordInput(e.target.value)} value={isPublic ? '' : passwordInput}></input>
      </div>
      <div>
        <label htmlFor='confirm-password'>Confirm password:</label>
        <input disabled={isPublic} type='password' id='confirm-password' onChange={(e) => setConfirmPasswordInput(e.target.value)} value={isPublic ? '' : confirmPasswordInput}></input>
      </div>
      <div>
        <label htmlFor="isPublic">Do you want this server to be public?</label>
        <input id="isPublic" type="checkbox" onChange={(e) => setIsPublic(e.target.checked)} checked={isPublic} />
      </div>
      <button onClick={(e) => submitForm(e)}>{isAnEdit ? 'Submit changes' : 'Create chat'}</button>
      {/* Displaying validation errors if any */}
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
    </form>
  );
};

export default CreateChat;
