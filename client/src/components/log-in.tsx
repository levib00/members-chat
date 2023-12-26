import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { validateLogIn, submitPost } from '../utility-functions/post-fetch';

// Props interface for the LogIn component
interface ILogInProps {
  hasAuth: boolean; // Indicates whether the user is already authenticated
  // Function to update the authentication status
  setHasAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

// LogIn functional component that handles user login
const LogIn = (props: ILogInProps) => {
  const { hasAuth, setHasAuth } = props; // Destructuring props

  // State variables for managing username, password inputs, and validation errors
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [validationError, setValidationError] = useState<string | string[]>('');
  const navigate = useNavigate(); // Accessing navigation function from React Router

  useEffect(() => { // Redirect if the user is already logged in
    if (hasAuth) {
      navigate('/'); // Redirect to the home page if already authenticated
    }
  });

  // Function to handle user login
  const logIn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Perform a POST request to log in the user
    submitPost(
      'http://localhost:3000/users/log-in',
      { username: usernameInput, password: passwordInput },
      e,
      validateLogIn,
      setValidationError,
      navigate,
      setHasAuth, // Update the authentication status after successful login
      () => null,
    );
  };

  // JSX rendering for the LogIn component
  return (
    <div className='main log-in-page'>
      {/* Login form */}
      <form action="" className='log-in-form'>
        <div className='log-in-input'>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" required onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput}/>
        </div>
        <div className='log-in-input'>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" required onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}/>
        </div>
        <button onClick={(e) => logIn(e)}>Log in</button>

        {/* Displaying validation errors if any */}
        {
          validationError && (
            <ul>
              {
                Array.isArray(validationError)
                  ? validationError.map((error: string) => <li key={uuid()}>{error}</li>)
                  : <li key={uuid()}>{validationError}</li>
              }
            </ul>
          )
        }
      </form>

      {/* Link to sign-up page */}
      <Link to='/sign-up'>Don't have an account?</Link>
    </div>
  );
};

export default LogIn;
