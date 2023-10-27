interface ChatroomCardProps {
  name: string,
  isPublic: boolean,
  password: string
};

const ChatroomCard = (props: ChatroomCardProps) => {

  return (
    <div>
      <div>{props.name.charAt(0)}</div>
      <div>{props.name}</div>
      <div>{props.isPublic ? 'public' : 'private'}</div>
    </div>
  )
}

export default ChatroomCard