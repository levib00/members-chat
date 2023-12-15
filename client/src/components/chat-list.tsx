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

// ChatroomList functional component
const ChatroomList = () => {
  const [adminInput, setAdminInput] = useState(''); // State for admin input
  const navigate = useNavigate(); // Accessing the navigation function from React Router

  // Fetching user data using SWR
  const { data: user, error: userError } = useSWR('http://localhost:3000/users/user', getFetcher);

  // Fetching chatroom data using SWR
  const { data: chatrooms } = useSWR('http://localhost:3000/chatrooms/', getFetcher);

  // Redirecting to login page if there's an error fetching user data or user is not signed in
  useEffect(() => {
    if (userError) {
      navigate('/log-in');
    }
  }, [userError]);

  return (
    <>
      <div>
        {/* Rendering input to make another user an admin if the current user is an admin */}
        {user?.isAdmin && <>
          <p>Enter a user's name to make them an admin:</p>
          <div>
            <input type='text' onChange={(e) => setAdminInput(e.target.value)} value={adminInput} />
            <button>Submit</button>
          </div>
        </>}
      </div>

      {/* Link to create a new chatroom page */}
      <Link to='/chatrooms/new'><button>Create a new chatroom</button></Link>

      {/* Mapping through chatrooms and rendering ChatroomCard component for each */}
      {user && chatrooms?.map(
        (chatroom: IChatroomInfo) => <ChatroomCard key={uuid()}
          chatroomInfo={chatroom}
          hasUser={(user?.chatrooms.includes(chatroom._id) || user?.isAdmin)} />,
      )}
    </>
  );
};

export default ChatroomList;
