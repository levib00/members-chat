import { Routes, Route, MemoryRouter, BrowserRouter } from "react-router-dom";
import NavBar from './components/nav.js'
import Home from "./components/home.js";
import SignUp from "./components/sign-up.js";
import './App.css'
import ChatroomList from "./components/chat-list.js";
import Chatroom from "./components/chatroom.js";
import CreateChat from "./components/create-chat.js";
import LogIn from "./components/log-in.js";
import Error from "./components/error.js";
import React, { useState } from "react";

export interface IErrorObject {
    status: number,
    info: string
};

const  App = () => {
  const [error, setError] = useState<IErrorObject>({} as IErrorObject)
  const [hasAuth, setHasAuth] = useState<boolean>(!!localStorage.getItem('jwt'))

  const parseDom = (str: string) => {  // Parses special characters from html code to unicode characters.
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  }

  return (
    <>
      <BrowserRouter>
        <NavBar hasAuth={hasAuth} setHasAuth={setHasAuth} />
        <Routes>
          <Route path='/' element={<Home hasAuth={hasAuth} />} />
          <Route path='/chatrooms' element={<ChatroomList setError={setError} />} />
          <Route path='/chatrooms/:chatroomId' element={<Chatroom setError={setError} />} />
          <Route path='/chatrooms/new' element={<CreateChat setError={setError} isAnEdit={false} chatroom={null}/>} />
          <Route path='/log-in' element={<LogIn hasAuth={hasAuth} setError={setError} setHasAuth={setHasAuth} />} />
          <Route path='/sign-up'  element={<SignUp hasAuth={hasAuth} setError={setError} setHasAuth={setHasAuth} /> } />
          <Route path='/error' element={<Error error={error} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
