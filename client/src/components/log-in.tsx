import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IErrorObject } from "../App";
import { validateLogIn, submitPost } from "../utility-functions/post-fetch";

interface ILogInProps {
  hasAuth: boolean,
  setError: React.Dispatch<React.SetStateAction<IErrorObject>>,
  setHasAuth: React.Dispatch<React.SetStateAction<boolean>>
}

const LogIn = (props: ILogInProps) => {
  const {hasAuth, setError, setHasAuth} = props
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [validationError, setValidationError] = useState('')
  const navigate = useNavigate();

  useEffect(() => { // Redirect if user is already logged in.
    if (hasAuth) {
      navigate('/')
    }
  })

  return (
    <>
      <form action="">
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput}/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="text" id="password" onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}/>
        </div>
        <button onClick={(e) => submitPost('localhost', {usernameInput, passwordInput}, e, validateLogIn, setError, setValidationError, navigate, null)}>Log in</button>
        <ul>
          <li>{validationError}</li>
        </ul>
      </form>
      <Link to='/sign-up'><button>Don't have an account?</button></Link>
    </>
  )
}

export default LogIn