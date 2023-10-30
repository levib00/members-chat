import React, { useState } from "react"
import ChatroomCard from "./chatroom-card"
import { getFetcher } from "../utility-functions/fetcher"
import useSWR from "swr"
import { randomUUID } from "crypto"

interface chatroomInfo {
  name: string,
  password: string,
  isPublic: boolean,
  chatroomId: string
}

const ChatroomList = () => {

  const {data: chatrooms,  error: chatroomError} = useSWR(`http://localhost:8000/chatrooms`, getFetcher)

  return (
    <>
      {chatrooms.map((response: chatroomInfo) => <ChatroomCard key={randomUUID()} chatroomInfo={response} />)}
    </>
  )
}

export default ChatroomList