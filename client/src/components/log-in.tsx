import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IErrorObject } from "../App";

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

  const submitLogIn = async(e: { preventDefault: () => void; }) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/users/log-in', {
        method: 'post',
        body : JSON.stringify({
          username: usernameInput,
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
        setHasAuth(!!localStorage.getItem('jwt'))
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
    <>
      <form action="">
        <div>
          <label htmlFor="username">UserName:</label>
          <input type="text" id="username" onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput}/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="text" id="password" onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}/>
        </div>
        <button>Log in</button>
        <ul>
          <li>{validationError}</li>
        </ul>
        <button onClick={submitLogIn}>Log in</button>
      </form>
      <Link to='/sign-up'><button>Don't have an account?</button></Link>
    </>
  )
}

export default LogIn