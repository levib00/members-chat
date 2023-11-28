import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { validateSignUp, submitPost } from '../utility-functions/post-fetch';

interface ISignUpProps {
  hasAuth: boolean,
}

const SignUp = (props: ISignUpProps) => {
  const { hasAuth } = props;
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [validationError, setValidationError] = useState<string | Array<string>>('');
  const navigate = useNavigate();

  useEffect(() => { // Redirect if user is already logged in.
    if (hasAuth) {
      navigate('/');
    }
  });

  const signUp = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    submitPost(
      'http://localhost:3000/users/sign-up',
      {
        firstName: firstNameInput,
        lastName: lastNameInput,
        username: usernameInput,
        password: passwordInput,
        passwordConfirmation: confirmPasswordInput,
      },
      e,
      validateSignUp,
      setValidationError,
      navigate,
      null,
      () => null,
    );
  };

  return (
    <>
      <form action="">
        <div>
          <label htmlFor='first-name'>First name:</label>
          <input type='text' id='first-name' required onChange={(e) => setFirstNameInput(e.target.value)} value={firstNameInput}/>
        </div>
        <div>
          <label htmlFor='last-name'>Last name:</label>
          <input type='text' id='last-name' required onChange={(e) => setLastNameInput(e.target.value)} value={lastNameInput}/>
        </div>
        <div>
          <label htmlFor='username'>UserName:</label>
          <input type='text' id='username' required onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput}/>
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input type='text' id='password' required onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}/>
        </div>
        <div>
          <label htmlFor='confirm-password'>Confirm Password:</label>
          <input type="text" id='confirm-password' required onChange={(e) => setConfirmPasswordInput(e.target.value)} value={confirmPasswordInput}/>
        </div>
        <button onClick={(e) => signUp(e)}>Sign up</button>
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
      <Link to='/' ><button>Already have an account?</button></Link>
    </>
  );
};

export default SignUp;
