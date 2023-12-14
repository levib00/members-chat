import { NavigateFunction } from 'react-router-dom';
import { ObjectId } from 'bson';

type IValidationFunctionArgs = (
  response: { [key: string]: any; },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
  setHasAuth: any, sendMessage: ((message: string) => void)) => Promise<void>;

export const validateCreateChat = async (
  response: { [key: string]: any; },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
) => {
  if (response.status === 200) {
    navigate('/chatrooms'); // Redirect if user successfully logged in.
    return response.status;
  }
  const errorResponse = await response.json();
  setValidationError(errorResponse.error);
  return errorResponse;
}; // TODO: maybe collapse these into DI function

export const validateMessageEdit = async (
  response: { [key: string]: any; },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
  setHasAuth: null,
  sendMessage: (message: string) => void,
) => {
  const jsonResponse: any = await response.json();
  if (response.status === 200) {
    const stringifiedResponse = JSON.stringify(jsonResponse);
    sendMessage(stringifiedResponse);
  } else {
    setValidationError(jsonResponse.error);
  }
  return jsonResponse;
};

export const validateCreateDeleteMessage = async (
  response: { [key: string]: any; },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
  setHasAuth: null,
  sendMessage: (message: string) => void,
) => {
  const jsonResponse: any = await response.json();
  if (response.status === 200) {
    const stringifiedResponse = JSON.stringify(await jsonResponse);
    sendMessage(stringifiedResponse);
  } else {
    setValidationError(await jsonResponse.error);
  }
  return jsonResponse;
};

export const validateJoinChatroom = async (
  response: { [key: string]: any },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
) => {
  const jsonResponse = await response.json();
  if (response.status === 200) {
    localStorage.setItem('jwt', await jsonResponse.token);
    navigate(`/chatrooms/${jsonResponse.chatroomId}`);
    return response.status;
  }
  if (jsonResponse.error) { // Sets and renders validation errors.
    setValidationError(jsonResponse.error);
    return jsonResponse.error;
  }
  return jsonResponse;
};

export const validateSignUp = async (
  response: { [key: string]: any },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
) => {
  if (response.status === 200) {
    navigate('/');
    return response.status;
  } if (response.status === 401) { // Sets and renders validation errors.
    setValidationError('Username or password are invalid.');
    return response.status;
  }
  const errorResponse = await response.json();
  setValidationError(errorResponse.error);
  return errorResponse;
};

export const validateLogIn = async (
  response: { [key: string]: any },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
  setHasAuth: any,
) => {
  if (response.status === 200) {
    const tokenObject = await response.json();
    localStorage.setItem('jwt', await tokenObject.token);
    setHasAuth(true);
    navigate('/');
    return response.status;
  }

  if (response.status === 401) { // Sets and renders validation errors.
    setValidationError('Wrong username or password.');
    return response.status;
  }
  const errorResponse = await response.json();
  setValidationError(errorResponse.error);
  return errorResponse;
};

export const validateLeaveChatroom = async (
  response: { [key: string]: any },
  navigate: NavigateFunction,
  setValidationError: React.Dispatch<React.SetStateAction<string | string[]>>,
) => {
  if (response.status === 200) {
    const tokenObject = await response.json();
    localStorage.setItem('jwt', await tokenObject.token);
    navigate('/chatrooms');
    return response;
  }
  const errorResponse = await response.json();
  setValidationError(errorResponse.error);
  return errorResponse;
};

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
  setValidationError(errorResponse.error);
  return errorResponse;
};

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
  e.preventDefault();
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'include',
      // @ts-ignore
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173',
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
    return await validationFunction(
      response,
      navigate,
      setValidationError,
      setHasAuth,
      sendMessage,
    );
  } catch (error: any) {
    setValidationError(error);
    return error;
  }
};
