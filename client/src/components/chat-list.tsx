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
  const { data: user, error: userError } = useSWR('https://levib00-chatroom.adaptable.app/users/user', getFetcher);

  // Fetching chatroom data using SWR
  const { data: chatrooms } = useSWR('https://levib00-chatroom.adaptable.app/chatrooms/', getFetcher);

  // Redirecting to login page if there's an error fetching user data or user is not signed in
  useEffect(() => {
    if (userError) {
      navigate('/members-chat/log-in');
    }
  }, [userError]);
  return (
    <div className='main chat-list-page'>
      <div className='admin-form'>
        {/* Rendering input to make another user an admin if the current user is an admin */}
        {user?.isAdmin && <>
          <label htmlFor='admin-input'>Enter a username to make them an admin:</label>
          <div className='admin-inputs'>
            <input type='text' id='admin-input' onChange={(e) => setAdminInput(e.target.value)} value={adminInput} />
            <button>Submit</button>
          </div>
        </>}
      </div>

      {/* Link to create a new chatroom page */}
      <Link className='create-chat-button' to='/members-chat/chatrooms/new'>Create a new chatroom</Link>

      {/* Mapping through chatrooms and rendering ChatroomCard component for each */}
      {(user && chatrooms)
      && <div className="chat-list">
        {chatrooms.map(
          (chatroom: IChatroomInfo) => <ChatroomCard key={uuid()}
            chatroomInfo={chatroom}
            hasUser={(user?.chatrooms.includes(chatroom._id) || user?.isAdmin)} />,
        )}
        </div>
        }
    </div>
  );
};

export default ChatroomList;
