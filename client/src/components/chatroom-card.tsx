import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { submitPost, validateJoinChatroom } from '../utility-functions/post-fetch';

interface IChatroomInfo {
  roomName: string,
  password: string,
  isPublic: boolean,
  _id: string
}

interface IChatroomCardProps {
  chatroomInfo: IChatroomInfo,
  hasUser: boolean,
}

const ChatroomCard = (props: IChatroomCardProps) => {
  const { chatroomInfo, hasUser } = props;
  const { roomName, isPublic, _id: id } = chatroomInfo;

  const [passwordInput, setPasswordInput] = useState('');
  const [validationError, setValidationError] = useState<string | Array<string>>('');
  const [isJoining, setIsJoining] = useState(false);

  const navigate = useNavigate();

  const clickJoin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if ((!isJoining && !isPublic) && !hasUser) {
      setIsJoining(true);
    } else if (hasUser) {
      navigate(`/chatrooms/${id}`);
    } else {
      const response = await submitPost(
        `http://localhost:3000/users/join/${id}`,
        { password: passwordInput },
        e,
        validateJoinChatroom,
        setValidationError,
        navigate,
        null,
        () => null,
      );
      if (typeof await response !== 'undefined') {
        navigate(`/chatrooms/${id}`);
      }
    }
  };

  return (
    <div>
      <div>{roomName.charAt(0)}</div>
      <div>{roomName}</div>
      <div>{isPublic ? 'public' : 'private'}</div>
      {isJoining ? <input type="password" onChange={(e) => setPasswordInput(e.target.value)} value={passwordInput}/> : null}
      <button onClick={(e) => clickJoin(e)}>{hasUser ? 'Chat' : 'Join'}</button>
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
