import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { validateSignUp, submitPost } from '../utility-functions/post-fetch';

// Props interface for the SignUp component
interface ISignUpProps {
  hasAuth: boolean; // Indicates whether the user is authenticated
}

// SignUp functional component for user registration
const SignUp = (props: ISignUpProps) => {
  const { hasAuth } = props; // Destructuring props

  // States to manage form inputs and validation errors
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [validationError, setValidationError] = useState<string | Array<string>>('');
  const navigate = useNavigate(); // Hook for navigating between pages

  useEffect(() => {
    // Redirect if user is already logged in
    if (hasAuth) {
      navigate('/');
    }
  });

  // Function to handle user registration (sign-up)
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
      validateSignUp, // Validation function for sign-up
      setValidationError,
      navigate,
      null,
      () => null,
    );
  };

  // JSX for the sign-up form
  return (
    <div className='main sign-up-page'>
      <form action="" className='sign-up-form'>
        <div className='sign-up-input'>
          <label htmlFor='first-name'>First name:</label>
          <input type='text' id='first-name' required onChange={(e) => setFirstNameInput(e.target.value)} value={firstNameInput}/>
        </div>
        <div className='sign-up-input'>
          <label htmlFor='last-name'>Last name:</label>
          <input type='text' id='last-name' required onChange={(e) => setLastNameInput(e.target.value)} value={lastNameInput}/>
        </div>
        <div className='sign-up-input'>
          <label htmlFor='username'>Username:</label>
          <input type='text' id='username' required onChange={(e) => setUsernameInput(e.target.value)} value={usernameInput}/>
        </div>
        <div className='sign-up-input'>
          <label htmlFor='password'>Password:</label>
          <input type='text' id='password' required onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}/>
        </div>
        <div className='sign-up-input'>
          <label htmlFor='confirm-password'>Confirm Password:</label>
          <input type="text" id='confirm-password' required onChange={(e) => setConfirmPasswordInput(e.target.value)} value={confirmPasswordInput}/>
        </div>
        <button onClick={(e) => signUp(e)}>Sign up</button>
        {
          // Display validation errors if any
          validationError && (
            <ul>
              {Array.isArray(validationError)
                ? validationError.map((error: string) => <li key={uuid()}>{error}</li>)
                : <li key={uuid()}>{validationError}</li>
              }
            </ul>
          )
        }
      </form>
      {/* Link to navigate to log-in page if user already has an account */}
      <Link to='/log-in' >Already have an account?</Link>
    </div>
  );
};

export default SignUp;
