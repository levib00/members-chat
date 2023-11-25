import React from "react"
import ChatroomCard from "./chatroom-card"
import { getFetcher } from "../utility-functions/fetcher"
import useSWR from "swr"
import { v4 as uuid } from "uuid"
import { Link } from "react-router-dom"
import { IErrorObject } from "../App"

interface IChatroomInfo {
  roomName: string,
  password: string,
  isPublic: boolean,
  _id: string
}

interface IChatroomListProps {
  setError: React.Dispatch<React.SetStateAction<IErrorObject>>
}

const ChatroomList = (props: IChatroomListProps) => {
  const { setError } = props

  const {data: user,  error: userError} = useSWR(`http://localhost:3000/users/user`, getFetcher)

  const {data: chatrooms,  error: chatroomError} = useSWR(`http://localhost:3000/chatrooms/`, getFetcher)

  return (
    <>
      <Link to='/chatrooms/new'><button>Create a new chatroom</button></Link>
      {user && chatrooms?.map((chatroom: IChatroomInfo) => <ChatroomCard key={uuid()} chatroomInfo={chatroom} setError={setError} hasUser={(user?.chatrooms.includes(chatroom._id) || user?.isAdmin)} />)}
    </>
  )
}

export default ChatroomList