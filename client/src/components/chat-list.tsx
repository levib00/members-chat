import React from "react"
import ChatroomCard from "./chatroom-card"
import { getFetcher } from "../utility-functions/fetcher"
import useSWR from "swr"
import { v4 as uuid } from "uuid"
import { Link } from "react-router-dom"

interface IChatroomInfo {
  roomName: string,
  password: string,
  isPublic: boolean,
  _id: string
}

const ChatroomList = () => {

  const {data: user,  error: userError} = useSWR(`http://localhost:3000/users/user`, getFetcher)

  const {data: chatrooms,  error: chatroomError} = useSWR(`http://localhost:3000/chatrooms/`, getFetcher)

  return (
    <>
      <Link to='/chatrooms/new'><button>Create a new chatroom</button></Link>
      {user && chatrooms?.map((chatroom: IChatroomInfo) => <ChatroomCard key={uuid()} chatroomInfo={chatroom} hasUser={(user?.chatrooms.includes(chatroom._id) || user?.isAdmin)} />)}
    </>
  )
}

export default ChatroomList