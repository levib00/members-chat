import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { validateCreateChat, submitPost } from '../utility-functions/post-fetch';

interface ICreateChatProps {
  isAnEdit: boolean,
  chatroom: {
    roomName: string,
    isPublic: boolean,
  } | null
}

const CreateChat = (props: ICreateChatProps) => {
  const { isAnEdit, chatroom } = props;
  const [chatNameInput, setChatNameInput] = useState(chatroom?.roomName || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [validationError, setValidationError] = useState<string | string[]>('');
  const [isTheSame] = useState(passwordInput === confirmPasswordInput);
  const [isPublic, setIsPublic] = useState(chatroom?.isPublic || false);
  const navigate = useNavigate();
  const { chatroomId } = useParams();

  const submitForm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (isTheSame) {
      if (isAnEdit) {
        try {
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
          setValidationError(error); // Redirect to error page if there is a non-validation error.
        }
      } else {
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
