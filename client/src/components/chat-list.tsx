import { useState } from "react"
import ChatroomCard from "./chatroom-card"
import useSWR from "swr"

interface ChatroomObject {
  name: string,
  password: string,
  isPublic: boolean
};

const ChatroomList = () => {

  const fetcher = (url: string) => fetch(url, { 
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    // 'Access-Control-Allow-Origin': '*',
    mode: 'cors'
  })
  .then(res => res.json())
  .catch(function(error) {
    console.log("error---", error)
  });

  const {data: chatrooms, mutate, error: commentError} = useSWR(`http://localhost:8000/chatrooms`, fetcher)

  return (
    <>
      <div>
        {chatrooms.map((response: ChatroomObject) => <ChatroomCard name={response.name} password={response.password} isPublic={response.isPublic} />)}
      </div>
    </>
  )
}

export default ChatroomList