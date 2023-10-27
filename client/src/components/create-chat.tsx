import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IErrorObject } from "../App";

interface ICreateChatProps {
  setError: React.Dispatch<React.SetStateAction<IErrorObject>>,
}

const CreateChat = (props: ICreateChatProps) => {

  const {setError} = props
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [validationError, setValidationError] = useState('')
  const navigate = useNavigate();

  const submitCreateChat = async(e: { preventDefault: () => void; }) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/users/log-in', {
        method: 'post',
        body : JSON.stringify({
          username: nameInput,
          password: passwordInput,
        }),
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // 'Access-Control-Allow-Origin': 'http://localhost:3000',
        mode: 'cors'
      })
      if (response.status === 200) {
        const tokenObject = await response.json()
        localStorage.setItem('jwt', await tokenObject.token)
        navigate('/') // Redirect if user successfully logged in.
      } else if (response.status === 401) { // Sets and renders validation errors.
        setValidationError('Wrong username or password.')
      } else {
        setValidationError('Something went wrong. Please try again.')
      }
    } catch (error: any) {
      setError(error)
      navigate('/error') // Redirect to error page if there is a non-validation error.
    }
  }

  return (
    <form>
      <div>
        <label htmlFor='chat-name'>Chat Name:</label>
        <input type='text' id='chat-name' onChange={(e) => setNameInput(e.target.value)} value={nameInput}></input>
      </div>
      <div>
        <label htmlFor='password'>password:</label>
        <input type='text' id='password' onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}></input>
      </div>
      <div>
        <label htmlFor='confirm-password'>confirm password:</label>
        <input type='text' id='password' onChange={(e) => setConfirmPasswordInput(e.target.value)} value={confirmPasswordInput}></input>
      </div>
      <button onClick={submitCreateChat}>Create chat</button>
      <ul>
        <li>{validationError}</li>
      </ul>
    </form>
  )
}

export default CreateChat