import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { v4 as uuid } from 'uuid';
import { Link, useNavigate } from 'react-router-dom';
import { getFetcher } from '../utility-functions/fetcher';
import ChatroomCard from './chatroom-card';

interface IChatroomInfo {
  roomName: string,
  password: string,
  isPublic: boolean,
  _id: string
}

const ChatroomList = () => {
  const [adminInput, setAdminInput] = useState('');
  const navigate = useNavigate();

  const { data: user, error: userError } = useSWR('http://localhost:3000/users/user', getFetcher);

  const { data: chatrooms } = useSWR('http://localhost:3000/chatrooms/', getFetcher);

  useEffect(() => {
    if (userError) {
      navigate('/log-in');
    }
  }, [userError]);

  return (
    <>
    <div>
    {user?.isAdmin && <>
      <p>Enter a users name to make them an admin:</p>
       <div>
        <input type='text' onChange={(e) => setAdminInput(e.target.value)} value={adminInput}/>
        <button>Submit</button>
      </div>
      </>}
    </div>
      <Link to='/chatrooms/new'><button>Create a new chatroom</button></Link>
      {user && chatrooms?.map(
        (chatroom: IChatroomInfo) => <ChatroomCard key={uuid()}
          chatroomInfo={chatroom}
          hasUser={(user?.chatrooms.includes(chatroom._id) || user?.isAdmin)} />,
      )}
    </>
  );
};

export default ChatroomList;
