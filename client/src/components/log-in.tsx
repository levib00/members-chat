import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { validateLogIn, submitPost } from '../utility-functions/post-fetch';

interface ILogInProps {
  hasAuth: boolean,
  setHasAuth: React.Dispatch<React.SetStateAction<boolean>>
}

const LogIn = (props: ILogInProps) => {
  const { hasAuth, setHasAuth } = props;
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [validationError, setValidationError] = useState<string | Array<string>>('');
  const navigate = useNavigate();

  useEffect(() => { // Redirect if user is already logged in.
    if (hasAuth) {
      navigate('/');
    }
  });

  const logIn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    submitPost(
      'http://localhost:3000/users/log-in',
      { username: usernameInput, password: passwordInput },
      e,
      validateLogIn,
      setValidationError,
      navigate,
      setHasAuth,
      () => null,
    );
  };

  return (
    <>
      <form action="">
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" required onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput}/>
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="text" id="password" required onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}/>
        </div>
        <button onClick={(e) => logIn(e)}>Log in</button>
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
      <Link to='/sign-up'><button>Don't have an account?</button></Link>
    </>
  );
};

export default LogIn;
