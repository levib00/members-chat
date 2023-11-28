import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import NavBar from './components/nav.js';
import Home from './components/home.js';
import SignUp from './components/sign-up.js';
import './App.css';
import ChatroomList from './components/chat-list.js';
import Chatroom from './components/chatroom.js';
import CreateChat from './components/create-chat.js';
import LogIn from './components/log-in.js';
import Error from './components/error.js';

export interface IErrorObject {
  status: number,
  info: string
}

const App = () => {
  const [error, setError] = useState<IErrorObject | undefined>();
  const [hasAuth, setHasAuth] = useState<boolean>(!!localStorage.getItem('jwt'));

  return (
    <>
      <BrowserRouter>
        <NavBar hasAuth={hasAuth} setHasAuth={setHasAuth} />
        <Routes>
          <Route path='/' element={<Home hasAuth={hasAuth} />} />
          <Route path='/chatrooms' element={<ChatroomList />} />
          <Route path='/chatrooms/:chatroomId' element={<Chatroom setError={setError} />} />
          <Route path='/chatrooms/new' element={<CreateChat isAnEdit={false} chatroom={null}/>} />
          <Route path='/log-in' element={<LogIn hasAuth={hasAuth} setHasAuth={setHasAuth} />} />
          <Route path='/sign-up' element={<SignUp hasAuth={hasAuth} /> } />
          <Route path='/error' element={<Error error={error} />} />
          <Route path='*' element={<Error error={error} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
