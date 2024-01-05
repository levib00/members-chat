import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import Icon from '@mdi/react';
import {
  mdiLock as locked,
  mdiLockOpen as unlocked,
} from '@mdi/js';
import { submitPost, validateJoinChatroom } from '../utility-functions/post-fetch';

// Defining the structure of chatroom information
interface IChatroomInfo {
  roomName: string,
  password: string,
  isPublic: boolean,
  _id: string
}

// Props interface for ChatroomCard component
interface IChatroomCardProps {
  chatroomInfo: IChatroomInfo,
  hasUser: boolean,
}

// ChatroomCard functional component
const ChatroomCard = (props: IChatroomCardProps) => {
  const { chatroomInfo, hasUser } = props;
  const { roomName, isPublic, _id: id } = chatroomInfo;

  const [passwordInput, setPasswordInput] = useState(''); // State for user input of password
  const [validationError, setValidationError] = useState<string | Array<string>>(''); // State for validation errors
  // State to track if user is in the process of joining
  const [isJoining, setIsJoining] = useState(false);

  const navigate = useNavigate(); // Accessing the navigation function from React Router

  // Function handling the join/chat button click
  const clickJoin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if ((!isJoining && !isPublic) && !hasUser) {
      setIsJoining(true);
    } else if (hasUser) {
      navigate(`/members-chat/chatrooms/${id}`);
    } else {
      // Sending a POST request to join the chatroom
      const response = await submitPost(
        `https://levib00-chatroom.adaptable.app/users/join/${id}`,
        { password: passwordInput },
        e,
        validateJoinChatroom,
        setValidationError,
        navigate,
        null,
        () => null,
      );
      if (typeof await response !== 'undefined') {
        navigate(`/members-chat/chatrooms/${id}`);
      }
    }
  };

  return (
    <div className='chatroom-card'>
      <div>{roomName}</div> {/* Displaying the full roomName */}
      <div>{isPublic ? <div className='lock-status locked'>
        <Icon path={unlocked} size={1} title={'unlocked'} />
        <div>
          public
        </div>
      </div> : <div className='lock-status locked'>
        <Icon path={locked} size={1} title={'locked'} />
        <div>
          private
        </div>
      </div>
      }
      </div> {/* Displaying if the room is public or private */}
      {isJoining ? <input type="password" onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput} /> : null}
      <button onClick={(e) => clickJoin(e)}>{hasUser ? 'Chat' : 'Join'}</button> {/* Rendering button text based on user status */}
      {
        validationError
        && <ul>
          {
            Array.isArray(validationError)
              ? validationError.map((error: string) => <li key={uuid()}>{error}</li>)
              : <li key={uuid()}>{validationError}</li>
          }
        </ul>
      }
    </div>
  );
};

export default ChatroomCard;
