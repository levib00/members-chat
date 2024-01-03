import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import NavBar from './components/nav.js';
import Home from './components/home.js';
import SignUp from './components/sign-up.js';
import './styles/App.scss';
import ChatroomList from './components/chat-list.js';
import Chatroom from './components/chatroom.js';
import CreateChat from './components/create-chat.js';
import LogIn from './components/log-in.js';
import Error from './components/error.js';
import Footer from './components/footer.js';

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
            <Route path='/members-chat' element={<Home hasAuth={hasAuth} />} />
            <Route path='/members-chat/chatrooms' element={<ChatroomList />} />
            <Route path='/members-chat/chatrooms/:chatroomId' element={<Chatroom setError={setError} />} />
            <Route path='/members-chat/chatrooms/new' element={<CreateChat isAnEdit={false} chatroom={null}/>} />
            <Route path='/members-chat/log-in' element={<LogIn hasAuth={hasAuth} setHasAuth={setHasAuth} />} />
            <Route path='/members-chat/sign-up' element={<SignUp hasAuth={hasAuth} /> } />
            <Route path='/members-chat/error' element={<Error error={error} />} />
            <Route path='/members-chat/*' element={<Error error={error} />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
