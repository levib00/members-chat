import { SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";
import { IErrorObject } from "../App";

type valFunctionArgs = (response: { [key: string]: any; }, navigate: NavigateFunction, setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, setHasAuth: any ) => Promise<void>

export const validateCreateChat = async(response: {[key: string]: any}, navigate: NavigateFunction, setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, setHasAuth: any) => {
  if (response.status === 200) {
    navigate('/chatrooms') // Redirect if user successfully logged in.
  } else if (response.status === 401) { // Sets and renders validation errors.
    setValidationError('Chat name or password are invalid.')
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
    setValidationError('Something went wrong. Please try again.')
  }
}

export const validateLogIn = async(response: {[key: string]: any}, navigate: NavigateFunction, setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, setHasAuth: any) => {
  if (response.status === 200) {
    const tokenObject = await response.json()
    localStorage.setItem('jwt', await tokenObject.token)
    setHasAuth(!!localStorage.getItem('jwt'))
    navigate('/')
  } else if (response.status === 401) { // Sets and renders validation errors.
    setValidationError('Wrong username or password.')
  } else {
    setValidationError('Something went wrong. Please try again.')
  }
}

export const submitPost = async(
 url: string,
 body: { [key: string]: string }, 
 e: { preventDefault: () => void; },
 validationFunction: valFunctionArgs,
 setError: { (value: SetStateAction<IErrorObject>): void; (arg0: any): void; }, 
 setValidationError: { (value: SetStateAction<string>): void; (arg0: string): void; }, 
 navigate: NavigateFunction,
 setHasAuth: any
 ) => {
  e.preventDefault()
  try {
    const response = await fetch(url, {
      method: 'post',
      body : JSON.stringify(body),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // 'Access-Control-Allow-Origin': 'http://localhost:3000',
      mode: 'cors'
    })
    validationFunction(response, navigate, setValidationError, setHasAuth)
  } catch (error: any) {
    setError(error)
    navigate('/error') // Redirect to error page if there is a non-validation error.
  }
};
