import { Routes, Route, MemoryRouter } from "react-router-dom";
import NavBar from './components/nav.js'
import Home from "./components/home.js";
import SignUp from "./components/sign-up.js";
import './App.css'
import ChatroomList from "./components/chat-list.js";
import Chatroom from "./components/chatroom.js";
import CreateChat from "./components/create-chat.js";
import LogIn from "./components/log-in.js";
import Error from "./components/error.js";
import { useState } from "react";

export interface IErrorObject {
    status: number,
    info: string
};

function App() {
  const [error, setError] = useState<IErrorObject>({} as IErrorObject) // TODO: Might register as true idk
  const [hasAuth, setHasAuth] = useState<boolean>(!!localStorage.getItem('jwt'))

  const parseDom = (str: string) => {  // Parses special characters from html code to unicode characters.
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  }

  return (
    <>
      <MemoryRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/' element={<ChatroomList />} />
          <Route path='/' element={<Chatroom />} />
          <Route path='/' element={<CreateChat setError={setError} />} />
          <Route path='/' element={<LogIn hasAuth={hasAuth} setError={setError} setHasAuth={setHasAuth} />} />
          <Route path='/sign-up'  element={<SignUp hasAuth={hasAuth} setError={setError} setHasAuth={setHasAuth} /> } />
          <Route path='error' element={<Error error={error} />} />
        </Routes>
      </MemoryRouter>
    </>
  )
}

export default App
