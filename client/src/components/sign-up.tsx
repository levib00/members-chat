import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IErrorObject } from "../App";
import { validateSignUp, submitPost } from "../utility-functions/post-fetch";

interface ISignUpProps {
  hasAuth: boolean,
  setError: React.Dispatch<React.SetStateAction<IErrorObject>>,
  setHasAuth: React.Dispatch<React.SetStateAction<boolean>>
}

const SignUp = (props: ISignUpProps) => {
  const {hasAuth, setError, setHasAuth} = props
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
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
          <label htmlFor='first-name'>First name:</label>
          <input type='text' id='first-name' onChange={(e) => setFirstNameInput(e.target.value)} value={firstNameInput}/>
        </div>
        <div>
          <label htmlFor='last-name'>Last name:</label>
          <input type='text' id='last-name' onChange={(e) => setLastNameInput(e.target.value)} value={lastNameInput}/>
        </div>
        <div>
          <label htmlFor='username'>UserName:</label>
          <input type='text' id='username' onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput}/>
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input type='text' id='password' onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}/>
        </div>
        <div>
          <label htmlFor='confirm-password'>Confirm Password:</label>
          <input type="text" id='confirm-password' onChange={(e) => setConfirmPasswordInput(e.target.value)} value={confirmPasswordInput}/>
        </div>
        <button onClick={(e) => submitPost('http://localhost:3000/users/sign-up', {firstName: firstNameInput, lastName: lastNameInput, username: usernameInput, password: passwordInput, passwordConfirmation: confirmPasswordInput}, e, validateSignUp, setError, setValidationError, navigate, null)}>Sign up</button>
        { 
          validationError && 
          <ul>
            <li>{validationError}</li>
          </ul>
          }
      </form>
      <Link to='/' ><button>Already have an account?</button></Link>
    </>
  )
}

export default SignUp