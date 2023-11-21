import { SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";
import { IErrorObject } from "../App";

type valFunctionArgs = (response: { [key: string]: any; }, navigate: NavigateFunction, setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, setHasAuth: any, ws: WebSocket | null) => Promise<void>

export const validateCreateChat = async(response: {[key: string]: any}, navigate: NavigateFunction, setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }) => {
  if (response.status === 200) {
    navigate('/chatrooms') // Redirect if user successfully logged in.
  } else {
    const errorResponse = await response.json()
    setValidationError(errorResponse.error)
  }
}

export const validateMessageEdit = async(response: { [key: string]: any; }, navigate: NavigateFunction, setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, setHasAuth: null, ws: WebSocket ) => {
  const jsonResponse = await response.json()
  if (response.status === 200) {
    // TODO: figure out how to send a message to ws
    
    ws.send(JSON.stringify(jsonResponse))
  } else {
    setValidationError(jsonResponse.error)
  }
}

export const validateCreateDeleteMessage = async(response: {[key: string]: any}, navigate: NavigateFunction, setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, setHasAuth: null, ws: any) => {
  const jsonResponse = await response.json()
  if (response.status === 200) {
    // TODO: figure out how to send a message to ws
    ws.send(JSON.stringify(jsonResponse))
  } else {
    setValidationError(jsonResponse.error)
  }
}

export const validateJoinChatroom = async(response: {[key: string]: any}, navigate: NavigateFunction, setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, setHasAuth: any) => {
  const jsonResponse = await response.json()
  if (response.status === 200) {
    return jsonResponse
    // figure out how to send a message to ws
  } else if (jsonResponse.error) { // Sets and renders validation errors.
    setValidationError(jsonResponse.error)
  } else {
    setValidationError('Something went wrong. Please try again.')
  }
}

export const validateSignUp = async(response: {[key: string]: any}, navigate: NavigateFunction, setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, setHasAuth: any) => {
  if (response.status === 200) {
    navigate('/')
  } else if (response.status === 401) { // Sets and renders validation errors.
    setValidationError('Username or password are invalid.')
  } else {
    const errorResponse = await response.json()
    setValidationError(errorResponse.error)
  }
}

export const validateLogIn = async(response: {[key: string]: any}, navigate: NavigateFunction, setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, setHasAuth: any,) => {
  if (response.status === 200) {
    const tokenObject = await response.json()
    localStorage.setItem('jwt', await tokenObject.token)
    setHasAuth(true);
    navigate('/')
  } else if (response.status === 401) { // Sets and renders validation errors.
    setValidationError('Wrong username or password.')
  } else {
    const errorResponse = await response.json()
    setValidationError(errorResponse.error)
  }
}

export const validateLeaveChatroom = async(response: {[key: string]: any}, navigate: NavigateFunction, setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, setHasAuth: any) => {
  if (response.status === 200) {
    navigate('/chatrooms')
  } else {
    const errorResponse = await response.json()
    setValidationError(errorResponse.error)
  }
}

export const submitPost = async(
 url: string,
 body: { [key: string]: string | boolean }, 
 e: { preventDefault: () => void; },
 validationFunction: valFunctionArgs,
 setError: { (value: SetStateAction<IErrorObject>): void; (arg0: any): void; }, 
 setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, 
 navigate: NavigateFunction,
 setHasAuth: any,
 ws: WebSocket | null,
 ) => {
  e.preventDefault()
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      credentials: 'include',
      //@ts-ignore
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        Authorization: (() => {
          const token = localStorage.getItem('jwt');
          if (token) {
            return 'Bearer ' + token
          }
          return null
        })()
      },      
      mode: 'cors'
    })
    return validationFunction(response, navigate, setValidationError, setHasAuth, ws)
  } catch (error: any) {
    setError(error) // Redirect to error page if there is a non-validation error.
  }
};
