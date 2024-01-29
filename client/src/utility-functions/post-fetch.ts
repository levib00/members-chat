import { NavigateFunction } from 'react-router-dom';
import { ObjectId } from 'bson';

type IValidationFunctionArgs = (
  response: { [key: string]: any; },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
  setHasAuth: any, sendMessage: ((message: string) => void)) => Promise<void>;

// Validation function for creating a chat room
export const validateCreateChat = async (
  response: { [key: string]: any; },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
) => {
  // Check the response status
  if (response.status === 200) {
    navigate('/members-chat/chatrooms'); // Redirect if successful
    return response.status;
  }
  // Handle errors by setting validation errors
  const errorResponse = await response.json();
  setValidationError(errorResponse.error);
  return errorResponse;
};

// Validate message edit function
export const validateMessageEdit = async (
  response: { [key: string]: any; },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
  setHasAuth: null, // A parameter that seems to be unused or explicitly set as null
  sendMessage: (message: string) => void,
) => {
  const jsonResponse: any = await response.json();
  if (response.status === 200) {
    const stringifiedResponse = JSON.stringify(jsonResponse);
    sendMessage(stringifiedResponse); // If successful, send the message
  } else {
    setValidationError(jsonResponse.error); // Set validation error if not successful
  }
  return jsonResponse;
};

// Validate create delete message function
export const validateCreateDeleteMessage = async (
  response: { [key: string]: any; },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
  setHasAuth: null, // Similar unused or explicitly set null parameter
  sendMessage: (message: string) => void,
) => {
  const jsonResponse: any = await response.json();
  if (response.status === 200) {
    const stringifiedResponse = JSON.stringify(await jsonResponse);
    sendMessage(stringifiedResponse); // If successful, send the message
  } else {
    setValidationError(await jsonResponse.error); // Set validation error if not successful
  }
  return jsonResponse;
};

// Validate join chat room function
export const validateJoinChatroom = async (
  response: { [key: string]: any },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
) => {
  const jsonResponse = await response.json();
  if (response.status === 200) {
    localStorage.setItem('jwt', await jsonResponse.token);
    navigate(`/members-chat/chatrooms/${jsonResponse.chatroomId}`); // Redirect to chat room if successful
    return response.status;
  }
  if (jsonResponse.error) {
    setValidationError(jsonResponse.error); // Set validation error if there's an error in response
    return jsonResponse.error;
  }
  return jsonResponse;
};

// Function for handling sign-up validation
export const validateSignUp = async (
  response: { [key: string]: any },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
) => {
  if (response.status === 200) {
    navigate('/members-chat/'); // Redirect to home page if successful
    return response.status;
  }
  if (response.status === 401) {
    setValidationError('Username or password are invalid.'); // Set validation error for specific status
    return response.status;
  }
  // Handle other errors by parsing the response and setting validation errors
  const errorResponse = await response.json();
  setValidationError(errorResponse.error);
  return errorResponse;
};

// Validate login function
export const validateLogIn = async (
  response: { [key: string]: any },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
  setHasAuth: any,
) => {
  if (response.status === 200) {
    const tokenObject = await response.json();
    localStorage.setItem('jwt', await tokenObject.token);
    setHasAuth(true); // Set authentication to true on successful login
    navigate('/members-chat/'); // Redirect to home page
    return response.status;
  }

  if (response.status === 401) {
    setValidationError('Wrong username or password.'); // Set validation error for wrong credentials
    return response.status;
  }
  const errorResponse = await response.json();
  setValidationError(errorResponse.error); // Set validation error from response
  return errorResponse;
};

// Validate leave chat room function
export const validateLeaveChatroom = async (
  response: { [key: string]: any },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
) => {
  if (response.status === 200) {
    const tokenObject = await response.json();
    localStorage.setItem('jwt', await tokenObject.token);
    navigate('/members-chat/chatrooms'); // Redirect to chat rooms on successful leaving
    return response;
  }
  const errorResponse = await response.json();
  setValidationError(errorResponse.error); // Set validation error if leaving fails
  return errorResponse;
};

// Validate make admin function
export const validateMakeAdmin = async (
  response: { [key: string]: any },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
) => {
  if (response.status === 200) {
    const tokenObject = await response.json();
    localStorage.setItem('jwt', await tokenObject.token);
    return response;
  }
  const errorResponse = await response.json();
  setValidationError(errorResponse.error); // Set validation error if making admin fails
  return errorResponse;
};

// Function for submitting a POST request
export const submitPost = async (
  url: string,
  body: { [key: string]: string | boolean | ObjectId },
  e: { preventDefault: () => void; },
  validationFunction: IValidationFunctionArgs,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
  navigate: NavigateFunction,
  setHasAuth: any,
  sendMessage: ((message: string) => void),
) => {
  e.preventDefault(); // Prevent default behavior of the event
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'include',
      // @ts-ignore
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://levib00.github.io',
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

    // Call the provided validation function based on the response status
    return await validationFunction(
      response,
      navigate,
      setValidationError,
      setHasAuth,
      sendMessage,
    );
  } catch (error: any) {
    console.error(error);
    setValidationError('Something went wrong.'); // Set error in case of an error
    return error;
  }
};
