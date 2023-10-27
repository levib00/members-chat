interface MessageProps {
  username: string,
  timeStamp: string,
  message: string
};

function Message(props: MessageProps) {

  return (
    <>
      <div>
        {props.username}
      </div>
      <div>
        {props.timeStamp}
      </div>
      <div>
        {props.message}
      </div>
    </>
  )
}

export default Message