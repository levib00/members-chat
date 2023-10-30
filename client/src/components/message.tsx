import React from "react";

interface MessageInfo {
  username: string,
  timeStamp: string,
  message: string
};

interface MessagesProps {
  messageInfo: MessageInfo,
};

function Message(props: MessagesProps) {
  const {messageInfo} = props;
  const {username, timeStamp, message} = messageInfo;

  const date = new Date(timeStamp);

  return (
    <>
      <div>
        {username}
      </div>
      <div>
        {`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}
      </div>
      <div>
        {message}
      </div>
    </>
  )
};

export default Message