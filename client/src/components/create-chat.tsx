import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IErrorObject } from "../App";
import { validateCreateChat, submitPost } from "../utility-functions/post-fetch";

interface ICreateChatProps {
  setError: React.Dispatch<React.SetStateAction<IErrorObject>>,
}

const CreateChat = (props: ICreateChatProps) => {

  const {setError} = props
  const [chatNameInput, setChatNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [validationError, setValidationError] = useState('')
  const navigate = useNavigate();

  return (
    <form>
      <div>
        <label htmlFor='chat-name'>Chat Name:</label>
        <input type='text' id='chat-name' onChange={(e) => setChatNameInput(e.target.value)} value={chatNameInput}></input>
      </div>
      <div>
        <label htmlFor='password'>Password:</label>
        <input type='password' id='password' onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}></input>
      </div>
      <div>
        <label htmlFor='confirm-password'>Confirm password:</label>
        <input type='password' id='confirm-password' onChange={(e) => setConfirmPasswordInput(e.target.value)} value={confirmPasswordInput}></input>
      </div> {/* TODO: set url */}
      <button onClick={(e) => submitPost('localhost', {chatNameInput, passwordInput, confirmPasswordInput} ,e, validateCreateChat ,setError, setValidationError, navigate, null)}>Create chat</button>
      <ul>
        <li>{validationError}</li>
      </ul>
    </form>
  )
}

export default CreateChat